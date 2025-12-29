<a id="readme-top"></a>

<div>
  <h1>🗣️ AWS Polly Text-to-Speech</h1>
  <p align="center">
    <img src="assets/amazon-polly-img.jpg" alt="amazon-polly" width="200"><br>
    <a target="_blank" href="https://ShenLoong99.github.io/my-terraform-aws-projects-2025/AWS-polly-text-to-speech/audio/
    ">🎵 [Click here to listen to the intro]</a>
  </p>
  <p>
      The <strong>AWS Polly Text-to-Speech</strong> project is a serverless cloud solution that converts text files stored in S3 into natural-sounding speech. Leveraging Amazon Polly, this application allows users to automatically generate audio from blogs, newsletters, scripts, or any text content. 
      <br />
    <a href="#about-the-project"><strong>Explore the docs »</strong></a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#built-with">Built With</a></li>
    <li><a href="#use-cases">Use Cases</a></li>
    <li><a href="#architecture">Architecture</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#usage">Usage & Testing</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#cost-optimization">Cost Optimization</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<h2 id="about-the-project">About The Project</h2>
<p>
    This project demonstrates the power of <strong>serverless AWS architecture</strong> and <strong>Infrastructure as Code (IaC)</strong> with Terraform. Text files uploaded to an S3 bucket are automatically processed by a Lambda function that calls Amazon Polly to generate MP3 audio files. This automated pipeline enhances accessibility, user engagement, and content distribution workflows.
</p>
<div align="right"><a href="#readme-top">↑ Back to Top</a></div>

<h2 id="built-with">Built With</h2>
<p>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/terraform/terraform-original.svg" alt="terraform" width="45" height="45" style="margin: 10px;"/>
  <img src="https://raw.githubusercontent.com/weibeld/aws-icons-svg/main/q1-2022/Resource-Icons_01312022/Res_Storage/Res_48_Light/Res_Amazon-Simple-Storage-Service_S3-Standard_48_Light.svg" alt="s3" width="45" height="45" style="margin: 10px;"/>
  <img src="https://raw.githubusercontent.com/weibeld/aws-icons-svg/main/q1-2022/Architecture-Service-Icons_01312022/Arch_Machine-Learning/48/Arch_Amazon-Polly_48.svg" alt="polly" width="45" height="45" style="margin: 10px;"/>
  <img src="https://raw.githubusercontent.com/weibeld/aws-icons-svg/main/q1-2022/Architecture-Service-Icons_01312022/Arch_Security-Identity-Compliance/48/Arch_AWS-Identity-and-Access-Management_48.svg" alt="iam" width="45" height="45" style="margin: 10px;"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" alt="python" width="45" height="45" style="margin: 10px;"/>
</p>
<ul>
  <li><strong>Terraform:</strong> Provision and manage AWS infrastructure (S3 buckets, IAM roles, Lambda) via IaC.</li>
  <li><strong>AWS S3:</strong> Secure object storage for input text files and output audio.</li>
  <li><strong>Amazon Polly:</strong> Converts text into high-quality speech.</li>
  <li><strong>AWS IAM:</strong> Implements least-privilege access for Lambda to interact with S3 and Polly.</li>
  <li><strong>Python (Boto3):</strong> Handles S3 events, Polly API calls, and audio file storage.</li>
</ul>
<div align="right"><a href="#readme-top">↑ Back to Top</a></div>

<h2 id="use-cases">Use Cases</h2>
<ul>
    <li><strong>Content Accessibility:</strong> Automatically generate audio versions of blog posts or newsletters.</li>
    <li><strong>Learning & Education:</strong> Convert textbooks or study materials into narrated audio for auditory learners.</li>
    <li><strong>Podcast & Media Automation:</strong> Quickly produce spoken content from written scripts.</li>
    <li><strong>Voice Assistants:</strong> Backend engine for applications that read content aloud on demand.</li>
</ul>
<div align="right"><a href="#readme-top">↑ Back to Top</a></div>

<h2 id="architecture">Architecture</h2>
<p align="center">
  <img src="assets/AWS-polly-text-to-speech.jpg" alt="Architecture Diagram" width="800">
</p>
<p>
  The serverless architecture is designed for simplicity, scalability, and cost-efficiency:
</p>
<ol>
  <li><strong>Input Layer:</strong> Users upload text files (articles, scripts, newsletters) to the input S3 bucket.</li>
  <li><strong>Processing Layer:</strong> A Lambda function is triggered by S3 events. It reads the text and calls Amazon Polly to synthesize speech.</li>
  <li><strong>Identity & Security:</strong> IAM role grants the Lambda permission to access the buckets and invoke Polly with least privilege.</li>
  <li><strong>Output Layer:</strong> Generated MP3 files are saved to the output S3 bucket. Optional lifecycle rules and encryption ensure cost savings and security.</li>
  <li><strong>CloudWatch Logs:</strong> Captures detailed Lambda execution logs for monitoring, debugging, and verifying Polly TTS output.</li>
</ol>
<div align="right"><a href="#readme-top">↑ Back to Top</a></div>

<h2 id="getting-started">Getting Started</h2>
<h3>Prerequisites</h3>
<ul>
    <li>Active <strong>AWS account</strong> with S3, Lambda, and Polly access.</li>
    <li><strong>Terraform CLI / Terraform Cloud(optional)</strong> for IaC deployment.</li>
    <li><strong>Python 3.x</strong> installed locally for testing Lambda code.</li>
</ul>

<h3>Installation & Deployment</h3>
<ol>
    <li>Clone the repository.</li>
    <li>Provision infrastructure via Terraform Cloud. Approve the plan to create S3 buckets, IAM roles, and Lambda function.</li>
    <li>Configure local environment variables (e.g., <code>OUTPUT_BUCKET</code>).</li>
</ol>
<div align="right"><a href="#readme-top">↑ Back to Top</a></div>

<h2 id="usage">Usage & Testing</h2>
<ol>
  <li>
    Upload a text file (e.g., <code>malaysia-news-article.txt</code>) to the input S3 bucket created by Terraform.<br>
    <pre>aws s3 cp &lt;text-file-name&gt; s3://&lt;your-s3-input-bucket-name&gt;</pre>
    <img src="assets/upload-text-into-bucket.png" alt="upload-file" width="800"><br><br>
    <img src="assets/input-bucket-objects.png" alt="input-bucket-objects" width="800">
  </li>
  <li>
    Verify if the file is being processed (or go to AWS console and check in your S3 output bucket)<br>
    <pre>aws s3 ls s3://&lt;your-s3-output-bucket-name&gt;</pre>
    <img src="assets/verify-files-in-bucket.png" alt="verify-file" width="800"><br><br>
    <img src="assets/output-bucket-objects.png" alt="output-bucket-objects" width="800">
  </li>
  <li>
    Check the output S3 bucket for the generated MP3 file by downloading it.<br>
    <pre>aws s3 cp s3://&lt;your-s3-output-bucket-name&gt;/&lt;audio-file-name&gt; &lt;destination/file-name&gt;</pre>
    <img src="assets/download-mp3-from-bucket.png" alt="verify-file" width="800"><br>
    <a target="_blank" href="https://ShenLoong99.github.io/my-terraform-aws-projects-2025/AWS-polly-text-to-speech/audio/
    ">🎵 [Click here to listen to the Output]</a>
  </li>
  <li>
    View CloudWatch logs to confirm successful execution or troubleshoot errors.<br>
    <img src="assets/log-events-lambda-polly.png" alt="verify-file" width="800">
  </li>
</ol>
<div align="right"><a href="#readme-top">↑ Back to Top</a></div>

<h2 id="roadmap">Project Roadmap</h2>
<ul>
  <li>[x] Input S3 bucket creation</li>
  <li>[x] Output S3 bucket creation with server-side encryption and lifecycle rules</li>
  <li>[x] IAM role & policy for Lambda</li>
  <li>[x] Lambda function development with Polly integration</li>
  <li>[x] Logging and error handling for CloudWatch</li>
  <li>[x] CLI and local testing setup</li>
</ul>
<div align="right"><a href="#readme-top">↑ Back to Top</a></div>

<h2 id="challenges-faced">Challenges</h2>
<table>
    <thead>
        <tr>
            <th>Challenge</th>
            <th>Solution</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>IAM Permission Errors</strong></td>
            <td>
                Refined IAM policies with least-privilege access and explicit CloudWatch permissions.
            </td>
        </tr>
        <tr>
            <td><strong>CloudWatch Logs Not Destroyed</strong></td>
            <td>
                Managed CloudWatch logs explicitly in Terraform with retention settings.
            </td>
        </tr>
        <tr>
            <td><strong>Lambda Packaging Issues</strong></td>
            <td>
                Used Terraform archive_file to package Lambda in a platform-independent way.
            </td>
        </tr>
        <tr>
            <td><strong>Polly Limits & Cost Control</strong></td>
            <td>
                Added character guardrails, S3 lifecycle rules, and resource tagging.
            </td>
        </tr>
        <tr>
            <td><strong>GitHub README Audio Limitation</strong></td>
            <td>
                Enabled GitHub Pages to host a simple HTML demo page.
            </td>
        </tr>
    </tbody>
</table>
<div align="right"><a href="#readme-top">↑ Back to Top</a></div>

<h2 id="cost-optimization">Cost Optimization (Free Tier)</h2>
<ul>
  <li><strong>Free Tier S3 & Polly:</strong> Small-scale demos stay within AWS free tier limits.</li>
  <li><strong>Lifecycle Rules:</strong> Automatically delete or transition audio files after 30 days to reduce storage costs.</li>
  <li><strong>Character Limits:</strong> Guard against text >10,000 characters per file to avoid unnecessary Polly charges.</li>
  <li><strong>Terraform Manual Apply:</strong> Prevents accidental resource creation that could incur costs.</li>
</ul>
<div align="right"><a href="#readme-top">↑ Back to Top</a></div>

<h2 id="contact">Contact</h2>
<p>Tan Si Kai - <a href="https://linkedin.com/in/si-kai-tan">LinkedIn</a></p>
<p>Project Link: <a href="https://github.com/ShenLoong99/my-terraform-aws-projects-2025/edit/main/AWS-polly-text-to-speech">AWS Polly Text-to-Speech Repo</a></p>
<div align="right"><a href="#readme-top">↑ Back to Top</a></div>
