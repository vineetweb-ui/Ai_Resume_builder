import dotenv from 'dotenv';
dotenv.config();
import OpenAI from "openai";

const ai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

async function test() {
    try {
       const systemprompt ="You are an expert AI Agent to extract data from resume."
       const userprompt = `extract data from this resume . John Doe, Software Engineer. Skills: React, Node.js. Experience: 2 years at Google.
       Provide data in the following JSON format with no additional text before or after:
       { professional_summary:{type:String,default:''},
    skills:{type:String},
    personal_info:{
        image:{type:String,default:''},
        full_name:{type:String,default:''},
        profession:{type:String,default:''},
        email:{type:String,default:''},
        phone:{type:String,default:''},
        location:{type:String,default:''},
        linkedin:{type:String,default:''},
        website:{type:String,default:''},
    },
    experience:[
        {
            company:{type:String},
            position:{type:String},
            start_date:{type:String},
            end_date:{type:String},
            description:{type:String},
            is_current:{type:Boolean}
        }
    ],
    project:[{
        name:{type:String},
        type:{type:String},
        description:{type:String}
    }
    ],
    education:[
        {
        institution:{type:String},
        degree:{type:String},
        field:{type:String},
        graduation_date:{type:String},
        gpa:{type:String}
        }
           
    ]
       }`
        const response = await ai.chat.completions.create({
            model:"gemini-2.5-flash",
            messages:[
                {role:"system",content:systemprompt},
                {role:"user",content:userprompt}
            ],
            response_format:{type:"json_object"}
        });
        const text = response.choices[0].message.content;
        console.log("Raw Output:", text);
        const parsed = JSON.parse(text);
        console.log("Parsed Successfully!");
    } catch (e) {
        console.error("Error:", e.message);
    }
}
test();
