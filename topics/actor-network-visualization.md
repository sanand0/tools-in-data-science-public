## Actor Network Visualization

Find the shortest path between Govinda & Angelina Jolie using IMDb data using Python: [networkx](https://pypi.org/project/networkx/) or [scikit-network](https://pypi.org/project/scikit-network).

[![Jolie No. 1](https://i.ytimg.com/vi_webp/lcwMsPxPIjc/sddefault.webp)](https://youtu.be/lcwMsPxPIjc)

- [Notebook: How this video was created](https://github.com/sanand0/jolie-no-1/blob/master/jolie-no-1.ipynb)
- [The data used to visualize the network](https://github.com/sanand0/jolie-no-1/blob/master/imdb-actor-pairing.ipynb)
- [The shortest path between actors](https://github.com/sanand0/jolie-no-1/blob/master/shortest-path.ipynb)
- [IMDb data](https://developer.imdb.com/non-commercial-datasets/)
- [Codebase](https://github.com/sanand0/jolie-no-1)

You'll learn how to analyze and visualize the social network of actors using IMDb data, covering:

- **Data Acquisition and Preparation:** Learn how to download and work with IMDb's non-commercial datasets. This includes using Python to read and process large TSV files.
- **Data Filtering and Wrangling:** Understand how to clean and filter large datasets to focus on relevant information, such as specific actor categories (actors/actresses) and movie titles, to make the data more manageable for analysis.
- **Actor Pairing and Network Creation:** Discover how to identify significant collaborations between actors by setting thresholds for the minimum number of films and co-appearances. You will learn to create a network of actors based on these pairings.
- **Handling Data Inconsistencies:** Learn techniques to manage real-world data issues, such as variations in actor names, to ensure the accuracy of your network.
- **Network Analysis with Python:** Get introduced to powerful Python libraries for network analysis like `networkx` and `scikit-network` to build, manipulate, and study the structure of complex networks.
- **Finding the Shortest Path:** Learn how to apply graph algorithms to find the shortest path between two actors in the network, demonstrating the "degrees of separation" concept.
- **Jupyter Notebook for Data Storytelling:** See how to use Jupyter Notebooks to document and present a data analysis project, combining code, text, and visualizations to tell a compelling story.
- **Exporting Results:** Learn how to export your findings, such as the actor pairings, into formats like Excel for further use or presentation.
