import mysql from 'mysql12/promise'
import dotenv from 'dotenv'

dotenv.config();

export const pool = mysql.createPool(
    host
)