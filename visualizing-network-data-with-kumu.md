## Visualizing Network Data with Kumu

[![Visualizing network data with Kumu](https://i.ytimg.com/vi_webp/OndB17bigkc/sddefault.webp)](https://youtu.be/OndB17bigkc)

- [Kumu](https://kumu.io)
- [IMDb data](https://developer.imdb.com/non-commercial-datasets/)
- [Jupyter Notebook](https://colab.research.google.com/drive/1CHR68fw7lZC9H2JtVW4LXpUvNwfM_VE-?usp=sharing)

[![Network analysis – filtering by year](https://i.ytimg.com/vi_webp/oi4fDzqsCes/sddefault.webp)](https://youtu.be/oi4fDzqsCes)

You'll learn about visualizing and analyzing relationships and networks using Kumu, covering:

- **Understanding Kumu**: What Kumu is and its primary function as a tool to **visualize complex relationships within data**. You'll learn that it's applicable beyond social analysis to **any scenario involving relationships between entities**.
- **Social Network Analysis**: How Kumu facilitates **social network analysis**, helping to understand how different people and communities are connected, and identifying common interests.
- **Data Preparation for Kumu**: The process of preparing raw data, specifically **IMDb actor data for Indian movies**, to be uploaded to Kumu. This includes filtering for only movies and Indian movies.
- **Creating Actor Networks**: How to construct an **actor collaboration matrix** where each element denotes the number of movies two actors have acted in together. This involves a method using **matrix multiplication** of a movie-actor matrix with its transpose.
- **Optimizing Sparse Matrices**: Understanding that actor collaboration matrices are often **sparse (contain many zero entries)** and how to make computations fast and memory-efficient using the **compressed sparse row (CSR) format** from the `scipy` library in Python.
- **Preparing Data for Kumu Upload**: How to convert the processed matrix data into the "from node to node" format, along with the **strength of the connection** (number of shared movies), which is required for Kumu.
- **Filtering Data Effectively**:
  - **Filtering by Year**: How to **filter movie data by release year** (e.g., movies released after 1950) by converting the 'start year' column to an integer data type, and troubleshooting common issues like newline characters (`/n`) within string data.
  - **Filtering by Language/Region**: How to filter for specific regions or languages, such as **Indian movies**, by applying language options within data processing functions or by filtering a dedicated region data frame.
  - **Filtering Actor Pairs**: How to reduce the data size by filtering for actors who have acted in a minimum number of movies and for actor pairs who have acted together in a minimum number of movies.
- **Visualizing and Analyzing Networks in Kumu**: How the prepared data creates a **network of actors in Kumu**, allowing you to observe **clusters** and understand direct and indirect connections.
- **Exploring Network Connections**: How to **search for specific actors** (e.g., Mohanlal) and examine their **direct connections** (e.g., Mohanlal and Saikumar acted in 8 movies) and **indirect connections** within the network.
- **Introduction to Community Detection**: A brief mention of **community detection** as a method to identify groups within the network and understand their interconnections, to be explored in other tutorials.
- **General Data Science Practices**: The importance of using resources like **Google and documentation** for problem-solving, even for seemingly simple tasks, and the necessity of ensuring correct data types for operations.
