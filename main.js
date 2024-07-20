require('dotenv').config();

const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = parseInt(process.env.APP_PORT);

// Middleware untuk parsing JSON
app.use(express.json());

// Route untuk menerima webhook
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.post('/:projectId/deploy/', (req, res) => {
    const projectId = req.params.projectId;
    let project_dir;

    if (projectId == '1') {
        project_dir = process.env.PROJECT1_DIR;
    } else if (projectId == '2') {
        project_dir = process.env.PROJECT2_DIR;
    } else {
        return res.status(400).send('Invalid projectId');
    }

    if (!project_dir) {
        return res.status(500).send('Project directory not configured');
    }

    const deployScript = path.join(project_dir, 'deploy.sh');

    exec(`sh ${deployScript}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing deploy script: ${error.message}`);
            return res.status(500).send('Error executing deploy script');
        }

        console.log(`Deploy script stdout: ${stdout}`);
        res.status(200).send('Deploy script executed successfully');
    });
});

// Mulai server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
