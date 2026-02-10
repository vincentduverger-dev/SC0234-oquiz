import Express from 'express'
import { logRouter } from './src/log.router.ts';

const PORT = process.env.PORT || 3001;

const app = Express()

// Démarre un serveur
app.listen(PORT, () => {
    console.info(`🚀 Server started at http://localhost:${PORT}`);
});

app.use('/logs', logRouter)