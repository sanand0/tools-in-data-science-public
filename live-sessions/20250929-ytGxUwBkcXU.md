# 2025 09 27 week 2 - Session 1 TDS Sep 2025

[![2025 09 27 week 2 - Session 1 TDS Sep 2025](https://i.ytimg.com/vi_webp/ytGxUwBkcXU/sddefault.webp)](https://youtu.be/ytGxUwBkcXU)

Duration: 2h 53m

Here's an FAQ based on the tutorial:

**Q1: Is the audio and screen sharing working correctly?**

**A1:** Yes, everything is working fine, and I am audible.

**Q2: What are the main challenges when setting up a development environment locally?**

**A2:** Running code locally involves several prerequisites like installing Python and specific libraries (e.g., Flask, FastAPI). A major challenge is that these installations often depend on your operating system, leading to compatibility issues and complex setups.

**Q3: How does containerization solve these local setup problems?**

**A3:** Containerization allows you to pack your application and all its dependencies (like Python and libraries) into a single, self-contained unit called an "image." This image is a single file (e.g., 500MB or more) that can be run consistently across different operating systems.

**Q4: How do I run a containerized application?**

**A4:** You use a container runtime like Podman (or Docker) to "run" the image. Once the image is running, it creates an isolated environment called a "container." You can then access your application directly (e.g., via a web browser using port forwarding) without worrying about host OS dependencies.

**Q5: What's the difference between Docker and Podman?**

**A5:** Docker and Podman are similar tools for containerization. The main difference is that Podman is open-source, while Docker is not. For the purpose of this tutorial, their core functionalities for creating and running containers are largely interchangeable.

**Q6: What are the key terms used in containerization, like "image" and "container"?**

**A6:**
*   An **Image** is a single, self-contained file (e.g., 500MB to several GB) that bundles your application code along with all its necessary prerequisites and dependencies (like Python, JEMA).
*   A **Container** is a live, isolated environment created by Podman (or Docker) where an image runs. It's like a lightweight virtual machine specifically for your application.
*   A **Pod** is a term used in Podman (similar to Kubernetes) to refer to a group of one or more containers that are deployed together and share resources.

**Q7: How do I install Podman on my system, especially if I'm using WSL (Windows Subsystem for Linux)?**

**A7:** To install Podman, you typically use `sudo apt-get install podman`. If you are running Podman within WSL (Ubuntu), you also need to install `qemu-system-x86` using `sudo apt-get install qemu-system-x86`. After installation, you can initialize the Podman machine with `podman machine init`.

**Q8: What if the `podman start` command doesn't work after installation?**

**A8:** Don't worry if `podman start` doesn't work. This command is primarily used to start a virtual machine for Podman, which might have issues in WSL. For our current project, we aren't using that server functionality. As long as other Podman commands (like `podman run`, `podman images`) work, your installation is functional, and you can proceed.

**Q9: What is "pulling" an image, and how do I do it?**

**A9:** "Pulling" an image means downloading a pre-built image from a public or private registry (like Docker Hub or Quay.io) to your local machine. You use the `podman pull [image_name]` command. For example, `podman pull jupyter/scipy-notebook` to download a Jupyter Lab image.

**Q10: What is the purpose of the Jupyter Lab image in this project?**

**A10:** We run a Jupyter Lab environment inside a container. This allows us to work with Python notebooks, write and execute code, and manage project files within an isolated and consistent environment.

**Q11: What is Ollama, and how is it used here?**

**A11:** Ollama is a tool that allows you to download and run large language models (LLMs) locally on your machine. We use it to run models like JEMA 3 (or Llama, Mistral) in a container, enabling local AI interactions without relying on external cloud APIs.

**Q12: How do I run an LLM model using Ollama in interactive mode?**

**A12:** After installing Ollama, you use `ollama run [model_name]` (e.g., `ollama run jema3:270m`). This command downloads the specified LLM model (if not already present) and then starts an interactive chat session in your terminal, similar to how ChatGPT works.

**Q13: How do I use Flask to create a web interface for Ollama?**

**A13:** You create a Python Flask application that defines web routes. When a user accesses a specific route (e.g., `/generate`), the Flask app takes their input, calls the Ollama LLM (which is running in its own container on the same network), sends the prompt, gets the response, and then displays that response back in the web browser.

**Q14: How do I manage persistent data and ensure files created in Jupyter Lab or Ollama are saved locally?**

**A14:** To ensure data persists even if a container is deleted, you use "volume mounting." This is done with the `-v` option in the `podman run` command. You specify a folder on your local machine (e.g., `C:/Users/harsh/work`) and map it to a folder inside the container (e.g., `/home/jovyan/work`). Any files saved in the container's mapped folder will then be stored directly on your local machine.

**Q15: How do different containers (like Jupyter Lab and Ollama) communicate with each other?**

**A15:** You create a "custom network" using `podman network create [network_name]`. Then, when you run each container, you connect them to this custom network using the `--network [network_name]` option. Once on the same network, containers can communicate with each other using their assigned names as hostnames (e.g., Flask app can talk to `ollama` container directly).

**Q16: How do I execute commands inside a running container, or install packages?**

**A16:** You use `podman exec -it [container_name] sh` (or `bash`) to get an interactive shell inside the container. Once inside, you can run any Linux commands, such as `apt-get install [package]` or `pip install [package]`, to manage the container's environment.

**Q17: What does the `podman logs -f` command do?**

**A17:** The `podman logs -f [container_name]` command streams the log output from a running container continuously in real-time. This is very useful for monitoring the container's activity and debugging.

**Q18: What is the plan for tomorrow's session?**

**A18:** Tomorrow, Juraj will cover GitHub Actions and how to deploy your containerized application to Hugging Face.

**Q19: What is the significance of the `podman run` options like `-d`, `--name`, `-p`, `-v`, and `--network`?**

**A19:**
*   `-d` (detached mode): Runs the container in the background, freeing up your terminal.
*   `--name [name]`: Assigns a human-readable name to your container (e.g., `jupylab`).
*   `-p [host_port:container_port]`: Maps a port from your host machine (e.g., 8888) to a port inside the container (e.g., 8888), allowing external access.
*   `-v [host_path:container_path]`: Mounts a local directory from your host to a directory inside the container for persistent storage.
*   `--network [network_name]`: Connects the container to a specific custom network, enabling inter-container communication.

**Q20: What are your recommendations for following the tutorial?**

**A20:** It's important to focus on understanding the *flow* and *abstraction* of the concepts rather than simply copy-pasting commands. All the code snippets will be available in the provided notes, and you can always use AI tools like ChatGPT for basic command generation. The goal is to build something functional, so grasping the "why" behind the steps is crucial.

**Q21: What is the `sh` command used for in `podman exec`?**

**A21:** `sh` (or `bash`) is used to start a shell session directly inside the running container. This allows you to interact with the container's internal environment using command-line instructions, similar to working on a Linux terminal.

**Q22: Is it possible to connect a single container to multiple networks?**

**A22:** Yes, a container can be configured to connect to multiple different virtual networks simultaneously.

**Q23: How do I know which internal port a service inside a container is using (e.g., Jupyter Lab or Ollama)?**

**A23:** You'll typically find this information in the documentation for the specific service or application you're running (e.g., Jupyter Lab's documentation specifies port 8888, Ollama's documentation specifies 11434).

**Q24: Can I use Ollama in interactive mode with Flask?**

**A24:** Yes, you can. I demonstrated building a Flask web application that serves as a user interface. This Flask app sends your prompts to the Ollama LLM (running in its own container) and displays the LLM's responses back in your browser, providing an interactive experience.

**Q25: What does the `#` symbol signify in the terminal output?**

**A25:** The `#` symbol at the beginning of the command prompt indicates that you are currently operating as the `root` user within the container.
