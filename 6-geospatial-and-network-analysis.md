# Geospatial and network analysis

Geospatial data and network data are ubiquitous.

- Almost every dataset has a location component.
- Any dataset with 2 categorical variables is a relationship and has a network component.

Yet, geospatial and network analysis is not common. That gives you an edge if you are able to apply it.

In this module, you'll learn:

- **Geo-data Collection & Processing**: Gather and process geospatial data using tools like Python (GeoPandas) and QGIS.
- **Geo-visualization**: Create and visualize geospatial data on maps using Excel, QGIS, and Python libraries such as Folium.
- **Network & Proximity Analysis**: Analyze geospatial relationships and perform network analysis to understand data distribution and clustering.
- **Storytelling & Decision Making**: Develop narratives and make informed decisions based on geospatial data insights.

## Geospatial analysis with Excel

[![Geospatial analysis with Excel](https://i.ytimg.com/vi_webp/49LjxNvxyVs/sddefault.webp)](https://youtu.be/49LjxNvxyVs)

You'll learn how to create a data-driven story about coffee shop coverage in Manhattan, covering:

- **Data Collection**: Collect and scrape data for coffee shop locations and census population from various sources.
- **Data Processing**: Use Python libraries like geopandas for merging population data with geographic maps.
- **Map Creation**: Generate coverage maps using tools like QGIS and Excel to visualize coffee shop distribution and population impact.
- **Visualization**: Create physical, Power BI, and video visualizations to present the data effectively.
- **Storytelling**: Craft a narrative around coffee shop competition, including strategic insights and potential market changes.

Here are links that explain how the video was made:

- [The Making of the Manhattan Coffee Kings](https://blog.gramener.com/the-making-of-manhattans-coffee-kings/)
- [Shaping and merging maps](https://blog.gramener.com/shaping-and-merging-maps/)
- [Visualizing data on 3D maps](https://blog.gramener.com/visualizing-data-on-3d-maps/)
- [Physical and digital 3D maps](https://blog.gramener.com/physical-and-digital-3d-maps/)

## Geospatial analysis with Python (GeoPandas)

[![Geospatial analysis with Python](https://i.ytimg.com/vi_webp/m_qayAJt-yE/sddefault.webp)](https://youtu.be/m_qayAJt-yE)

You'll learn how to perform geospatial analysis for location-based decision making, covering:

- **Distance Calculation**: Compute distances between various store locations and a reference point, such as the Empire State Building.
- **Data Visualization**: Visualize store locations on a map using Python libraries like Folium.
- **Store Density Analysis**: Determine the number of stores within a specified radius.
- **Proximity Analysis**: Identify the closest and farthest stores from a specific location.
- **Decision Making**: Use geospatial data to assess whether opening a new store is feasible based on existing store distribution.

Here are links used in the video:

- [Jupyter Notebook](https://colab.research.google.com/drive/1TwKw2pQ9XKSdTUUsTq_ulw7rb-xVhays?usp=sharing)
- Learn about the [`pandas` package](https://pandas.pydata.org/pandas-docs/stable/user_guide/10min.html) and [video](https://youtu.be/vmEHCJofslg)
- Learn about the [`numpy` package](https://numpy.org/doc/stable/user/whatisnumpy.html) and [video](https://youtu.be/8JfDAm9y_7s)
- Learn about the [`folium` package](https://python-visualization.github.io/folium/latest/) and [video](https://youtu.be/t9Ed5QyO7qY)
- Learn about the [`geopy` package](https://pypi.org/project/geopy/) and [video](https://youtu.be/3jj_5kVmPLs)

## Geospatial analysis with QGIS

[![Geospatial analysis with QGIS](https://i.ytimg.com/vi_webp/tJhehs0o-ik/sddefault.webp)](https://youtu.be/tJhehs0o-ik)

You'll learn how to use QGIS for geographic data processing, covering:

- **Shapefiles and KML Files**: Create and manage shapefiles and KML files for storing and analyzing geographic information.
- **Downloading QGIS**: Install QGIS on different operating systems and familiarize yourself with its interface.
- **Geospatial Data**: Access and utilize shapefiles from sources like Diva-GIS and integrate them into QGIS projects.
- **Creating Custom Shapefiles**: Learn how to create custom shapefiles when existing ones are unavailable, including creating a shapefile for South Sudan.
- **Editing and Visualization**: Use QGIS tools to edit shapefiles, add attributes, and visualize geographic data with various styling and labeling options.
- **Exporting Data**: Export shapefiles or KML files for use in other applications, such as Google Earth.

Here are links used in the video:

- [QGIS Project](https://www.qgis.org/en/site/)
- [Shapefile Data](https://www.diva-gis.org/gdata)

### Geospatial analysis - Live Coding

[![Geospatial Analysis - Live Coding](https://i.ytimg.com/vi_webp/wjmETHEwJSQ/sddefault.webp?)](https://youtu.be/wjmETHEwJSQ)

## Network analysis in Python

[![Talk: Exploring the Movie Actor Network in Python](https://i.ytimg.com/vi_webp/uPL3VuRqOy4/sddefault.webp)](https://youtu.be/uPL3VuRqOy4)

You'll learn how to use network analysis to identify clusters and connections between nodes in a dataset, covering:

- **Network Construction**: Build a network from the IMDB database, where nodes represent actors and edges represent shared movie appearances.
- **Clustering**: Apply clustering techniques to detect communities within the network, using scikit-learn's network library.
- **Matrix Operations**: Utilize matrix operations to efficiently analyze actor relationships and interactions.
- **Community Detection**: Implement algorithms to identify and interpret clusters, examining how different actor clusters are connected.
- **Application of Findings**: Explore practical applications of network analysis, such as social network analysis and its potential uses in various domains.

Here are links used in the video:

- [Jupyter Notebook](https://colab.research.google.com/drive/1VRlAOfREGwflv7v2VmN-6O_wqRno4Xcq?usp=sharing)
- [Exploring the Movie Actor Network in Python](https://youtu.be/6hzLw80qxto)
- [Jupyter Notebook - Shortest Path](https://colab.research.google.com/drive/1-b0pA1O6rCS-ZwU_MWdCzx0CEI_WnyZ2)
- [Jupyter Notebook - Actor network](https://colab.research.google.com/drive/1Lps2fkRlyPAnR63hDOihzCaMvo_RU6Ds)
- [IMDb Datasets](https://developer.imdb.com/non-commercial-datasets/)
- Learn about the [`sknetwork` package](https://scikit-network.readthedocs.io/en/latest/use_cases/votes.html)
- Learn about the [scipy.sparse matrices](https://cmdlinetips.com/2018/03/sparse-matrices-in-python-with-scipy/) and [video](https://youtu.be/v_S7cOL5ZWU)
- [Introduction to Kumu](https://youtu.be/fwiz7PnipgQ)
- [Network analysis with Kumu](https://docs.kumu.io/guides/disciplines/sna-network-mapping)
- [Introduction to Systems and Network Mapping with Kumu](https://www.coursera.org/projects/systems-network-kumu)
