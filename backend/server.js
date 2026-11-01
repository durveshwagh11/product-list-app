import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import path from 'path';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { initSchema } from './models/schema.js';

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

// Render sits behind one proxy hop; needed so rate limiting sees the real client IP
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);

app.use(express.json());
app.use(cookieParser());
app.use(helmet({ contentSecurityPolicy: false })); // sets security-related HTTP headers
app.use(morgan('dev')); // log the request

// general API rate limit (per IP); auth routes add a stricter one
app.use(
	'/api',
	rateLimit({
		windowMs: 60 * 1000,
		limit: 100,
		message: { success: false, message: 'Too many requests' },
	})
);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

if (process.env.NODE_ENV === 'production') {
	// serve our react app
	app.use(express.static(path.join(__dirname, '/frontend/dist')));

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
	});
}

initSchema()
	.then(() => {
		console.log('Database initialized successfully');
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	})
	.catch((error) => {
		console.error('Failed to initialize the database:', error);
		process.exit(1);
	});
