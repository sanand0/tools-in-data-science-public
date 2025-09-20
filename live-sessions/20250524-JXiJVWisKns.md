# 2025 05 23 Week 2 Session 2 - Github Actions, Docker - TDS May 2025

[![2025 05 23 Week 2 Session 2 - Github Actions, Docker - TDS May 2025](https://i.ytimg.com/vi_webp/JXiJVWisKns/sddefault.webp)](https://youtu.be/JXiJVWisKns)

Duration: 11854.0Here's an FAQ based on the provided transcript:

**Q1: I missed previous TDS sessions and have started Graded Assignment 2. I've completed 6-7 questions. How many hours a day should I spend over the next 2-3 days to cover the remaining topics for Graded Assignment 2?**

**A1:** I recommend You watch the last two sessions. Yesterday's session covered NGrok and OLama, and today's session will cover Docker, CI/CD, and GitHub Actions. These two sessions should be enough for You to cover the whole assignment.

**Q2: I'm having issues deploying to Vercel. It's showing errors, even though it indicates everything is running.**

**A2:** I understand You're facing Vercel deployment errors. The Wednesday session covered Vercel in depth, and I recommend You review that content. We will also address Vercel at the end of this session if You still have questions.

**Q3: I have a doubt regarding the assignment.**

**A3:** We will cover assignment-related doubts after this session.

**Q4: In GitHub, will the action automatically run the script to containerize and push the image?**

**A4:** Correct.

**Q5: Should I follow along by operating in a remote window within WSL, or can I do it from Windows?**

**A5:** I'm primarily demonstrating the final product. Following along directly might take too much time due to the breadth of topics. I suggest You take notes, perhaps in a mind map format, instead.

**Q6: Why do we need an extra server like Docker Hub to upload images? Can't I upload them directly to Azure VM?**

**A6:** While You could potentially upload images directly to Your Azure VM, Docker Hub serves as a standard and efficient way to manage container images. Image sizes can be quite large (200-300 MB), and Docker Hub provides a centralized and streamlined platform for storing, sharing, and versioning these images.

**Q7: Is a single space required between a key and its value in YAML, or is it not compulsory?**

**A7:** A single space is compulsory between a key and its value in YAML. If You omit it, You will get an error.

**Q8: If I just write Python code and push it to GitHub, what happens next?**

**A8:** When You push Your code to GitHub, GitHub Actions will automatically trigger. This will first containerize Your code into a Docker image, push that image to Docker Hub, notify Your Azure VM, and finally Your Azure VM will pull the new image and redeploy the application. This entire process, from pushing code to redeployment, is automated via GitHub Actions.

**Q9: When writing lists in YAML, do I use spaces or tabs for indentation?**

**A9:** In YAML, You should use spaces for indentation, not tabs. Tabs are not allowed.

**Q10: What is the benefit of using Docker Hub over running the app directly via Python?**

**A10:** The main benefit is portability and ease of deployment. With Docker Hub, You create a Docker image of Your application. This image can then be pulled and run on any machine (local or cloud) that has Docker installed, using just a single command. This eliminates the need to set up virtual environments, install dependencies, or worry about OS-specific commands, making the deployment process much faster and more consistent.

**Q11: What is the difference between Podman and Docker?**

**A11:** Both Podman and Docker are containerization tools that allow You to create and manage containers. However, there are key differences:

- **Daemon/Rootless:** Podman is daemonless and rootless, meaning it doesn't require a background daemon or root privileges to run containers. This makes it more lightweight and potentially more secure. Docker, on the other hand, typically relies on a daemon and often requires root access.
- **Weight:** Podman is generally more lightweight due to its daemonless architecture.
- **Open Source:** Podman is fully open source. Docker has open-source components but also proprietary offerings.
- **Features/Maturity:** Docker has been around longer and offers a more mature ecosystem with additional features like Docker Compose and Swarm for orchestration. Podman is catching up and offers similar functionalities (e.g., Podman Compose).
- **Code:** The commands for building and managing containers are largely the same between Podman and Docker.

**Q12: If I destroy the container here, will the database also be lost?**

**A12:** Yes, if You destroy the container, the database within that container will be lost. To prevent data loss, You need to use a feature called "volume mount." This allows You to persist data by storing it outside the container, in Your host machine's file system or a dedicated storage service.

**Q13: How can I view the container logs?**

**A13:** You can view the container logs using the `podman logs` command followed by the container's name or ID. For live logs, You can add the `-f` (follow) option.

**Q14: What is the purpose of the `.dockerignore` file?**

**A14:** The `.dockerignore` file specifies files and directories that should be excluded when building a Docker image. This helps to keep the image size down and avoids including unnecessary or sensitive files (like virtual environments or configuration files) in Your container image.

**Q15: What is the `chmod 600` command used for?**

**A15:** The `chmod 600` command sets file permissions. It grants read and write permissions only to the owner of the file and revokes all permissions for other users and groups. This is crucial for securing Your private SSH keys, ensuring that only You can access them.

**Q16: Can I access the website even if the container is running in isolation?**

**A16:** Yes, but You need to explicitly expose the container's port to a port on Your host machine. This is done using the `-p` (publish) option with `podman run` (e.g., `-p 8080:80` to map host port 8080 to container port 80). Without this, the container is isolated, and its services are not accessible externally.

**Q17: What does the `-d` flag in `podman run` do?**

**A17:** The `-d` flag (for "detached") runs the container in the background, allowing You to continue using Your terminal. It prevents the container from stopping when You close the shell. If You don't use `-d`, the container will run in the foreground, and its processes will terminate when the terminal is closed.

**Q18: What is the purpose of the `.env` file?**

**A18:** The `.env` file stores environment variables, often used for configuration settings or sensitive data like API keys. It allows You to keep these variables separate from Your main codebase. When running Your application, You can load these variables into the environment, making them accessible to Your code.

**Q19: If the app is redeployed, will the old data in the database be lost?**

**A19:** Yes, if the database is part of the container that is destroyed and redeployed, the data will be lost. This is why "volume mounts" are essential for persisting data. By mounting a host directory or a named volume, the data lives independently of the container and is not lost during redeployments.

**Q20: What is the difference between an "on" container, an "off" container, and a "destroyed" container?**

**A20:**

- **On (Running) Container:** A container that is actively executing its processes. Equivalent to a computer that is powered on and running.
- **Off (Stopped) Container:** A container whose processes are not running, but its file system state is preserved. Equivalent to a computer that is shut down but can be restarted without losing its installed software or files.
- **Destroyed Container:** A container that has been completely removed from the system. All its associated data (unless persisted via volumes) is deleted. Equivalent to a computer that has been wiped clean or physically removed.

**Q21: How can I find the current working directory and list its contents inside a Docker container during execution?**

**A21:** You can use the `podman exec` command to run commands inside a running container. For example, `podman exec -it <container_id> pwd` will show the present working directory, and `podman exec -it <container_id> ls -la` will list the contents.

**Q22: Why is the `~/.ssh/id_rsa` file not accessible by other users, and what is its purpose?**

**A22:** The `~/.ssh/id_rsa` file is Your private SSH key. It's crucial for security that only You (the owner) have read and write access to this file. This ensures unauthorized users cannot access Your key and impersonate You. Its purpose is to securely authenticate You to remote servers (like GitHub or Azure VMs) without needing a password.

**Q23: What is the Azure VM's role in this CI/CD pipeline?**

**A23:** The Azure VM is the final deployment target. Once a new Docker image is pushed to Docker Hub by GitHub Actions, the Azure VM receives a notification. It then automatically pulls the new image and redeploys the application, ensuring Your web application is always running the latest version of Your code. This entire process is automated.

**Q24: What is the significance of "Red Hat Actions" for Docker login?**

**A24:** "Red Hat Actions" (likely referring to a specific GitHub Action provided by Red Hat or a community action for Red Hat's container registry) offers a convenient way to integrate container login into Your CI/CD workflow. It's essentially a pre-built script that simplifies the process of logging into a Docker registry (like Docker Hub) from within Your GitHub Actions workflow, using securely stored tokens.

**Q25: What is the difference between a virtual environment and a container?**

**A25:**

- **Virtual Environment:** Primarily isolates Python (or other language) dependencies. It ensures Your project has its own set of libraries, preventing conflicts with other projects on Your machine. It runs directly on Your host OS and shares the host kernel.
- **Container:** Provides a more comprehensive form of isolation. It packages Your application and all its dependencies (including system libraries and even a minimal OS) into a single, portable unit. Containers run on top of a container runtime (like Docker or Podman) and share the host kernel but are isolated from the host OS and other containers.

**Q26: What is a Dockerfile, and what is its role in building a Docker image?**

**A26:** A Dockerfile is a text file that contains a set of instructions for building a Docker image. It defines the base image, copies application code, installs dependencies, sets environment variables, and specifies the command to run when the container starts. The Dockerfile acts as a blueprint, allowing You to automate the image creation process reliably and reproducibly.

**Q27: Is it possible to share the presentation slides from this tutorial?**

**A27:** Yes, if the professor allows, the presentation slides will be shared on my website under a "TDS" subject. You can find the link on my website.

**Q28: If the application is redeployed, will the website be inaccessible for a short period?**

**A28:** Yes, for a brief moment during the redeployment process, the website might become temporarily inaccessible as the old container is stopped and the new one starts up. In production environments, more advanced deployment strategies (like blue/green deployments or rolling updates) are used to minimize downtime.
