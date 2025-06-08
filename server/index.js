import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/db.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoute.js'
import userRoutes from './routes/userRoute.js'
import tutorRoutes from './routes/tutorRoute.js'
import sessionRoutes from './routes/sessionRoute.js'
import adminRoutes from './routes/adminRoute.js'
import feedbackRoutes from './routes/feedbackRoute.js'
import cors from 'cors'
// configs
dotenv.config({path:'../.env'})


//-------------------------App connection----------------------------
const app= express();
app.use(cors({
        origin: "http://localhost:5173",
        credentials: true,
}))
const PORT=process.env.PORT|3000;
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//...........................routes.......................................
app.use('/api/auth',authRoutes);
app.use('/api/users',userRoutes);
app.use('/api/tutor/match',tutorRoutes)
app.use('/api/sessions',sessionRoutes);
app.use('api/admin',adminRoutes);
app.use('api/feedback',feedbackRoutes);

connectDb().then((db)=>{
        app.listen(PORT,()=>{
                console.log(`Server is listening at port ${PORT} and db Host is ${db.connection.host}`);
        });
}).catch((err)=>{
        console.error('Error at connecting db: ->'+err);
})



export default app;

