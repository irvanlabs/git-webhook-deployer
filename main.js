require('dotenv').config();

const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = parseInt(process.env.APP_PORT);

// Middleware untuk parsing JSON
app.use(express.json());

// Route untuk menerima webhook
app.post('/:projectId/webhook/', (req, res) => {
    let project_dir;
    if(req.params.projectId==1){
        project_dir = process.env.PROJECT1_DIR
    } else if(req.params.projectId==2){
        project_dir = process.env.PROJECT2_DIR
    }

    // Jalankan skrip
    exec(`sh ${project_dir}/deploy.sh`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing deploy script: ${error.message}`);
            return res.status(500).send('Error executing deploy script');
        }

        if (stderr) {
            console.error(`Deploy script stderr: ${stderr}`);
            return res.status(500).send('Error in deploy script');
        }

        console.log(`Deploy script stdout: ${stdout}`);
        res.status(200).send('Deploy script executed successfully');
    });
});

// Mulai server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
