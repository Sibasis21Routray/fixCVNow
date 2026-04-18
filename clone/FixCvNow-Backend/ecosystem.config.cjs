module.exports={
 apps: [
   {
     name: "backend",
     script: "index.js",
     interpreter: "./node_modules/.bin/tsx,
     watch: false,
     env:{
       NODE_ENV: "production",
     },
   },
  ],
};