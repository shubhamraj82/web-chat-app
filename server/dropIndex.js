import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dropEmailIndex = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
        console.log("Database:", mongoose.connection.db.databaseName);
        
        // Check if messages collection exists
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Available collections:", collections.map(c => c.name));
        
        const messagesExists = collections.some(c => c.name === 'messages');
        
        if (!messagesExists) {
            console.log("ℹ️  Messages collection doesn't exist yet. No action needed.");
            process.exit(0);
            return;
        }
        
        // List all indexes on messages collection
        const indexes = await mongoose.connection.db.collection('messages').indexes();
        console.log("Current indexes on messages collection:", JSON.stringify(indexes, null, 2));
        
        // Try to drop the email_1 index if it exists
        const hasEmailIndex = indexes.some(idx => idx.name === 'email_1');
        if (hasEmailIndex) {
            await mongoose.connection.db.collection('messages').dropIndex('email_1');
            console.log("✅ Successfully dropped email_1 index from messages collection");
        } else {
            console.log("ℹ️  No email_1 index found on messages collection");
        }
        
        process.exit(0);
    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
};

dropEmailIndex();
