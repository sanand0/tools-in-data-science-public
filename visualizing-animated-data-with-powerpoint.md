## Visualizing Animated Data with PowerPoint

[![Visualizing animated data with PowerPoint](https://i.ytimg.com/vi_webp/umHlPDFVWr0/sddefault.webp)](https://youtu.be/umHlPDFVWr0)

You'll learn how to create an animated bar chart race in PowerPoint, covering:

- **Using the Morph Transition**: How to leverage PowerPoint's Morph feature to animate the resizing and reordering of bars between slides, which is the core technique for the race effect.
- **Manual Bar Creation**: The process of using individual shapes (rectangles) instead of a standard chart and how to size them accurately to represent your data values.
- **Adding and Syncing Audio**: How to record a voiceover for each slide, add background music that plays across the entire presentation, and sync them with the animations.
- **Automating Playback**: Setting up automatic slide transitions to create a self-playing, video-like presentation that advances after the narration for each slide is complete.
- **Exporting as a Video**: The steps to save your final animation as an MPEG-4 video file directly from PowerPoint and the suggestion of alternative methods like OBS for higher quality.
- **Prototyping Data Stories**: Understanding the manual effort required for this method and how it allows for careful control when prototyping and crafting a specific visual narrative.

## How to make bar chart race in PowerPoint

[Source: How to make a bar chart race in PowerPoint](https://blog.gramener.com/bar-chart-race-in-powerpoint/)

Flourish made [bar chart races](https://app.flourish.studio/@flourish/bar-chart-race) easy to create. That sparked a data visualization meme with hundreds of bar chart races like these going viral.

[A Flourish data visualization](https://flourish.studio/?utm_source=showcase&utm_campaign=visualisation/496212)

With PowerPoint’s [morph transition](https://support.office.com/en-us/article/Use-the-Morph-transition-in-PowerPoint-8DD1C7B2-B935-44F5-A74C-741D8D9244EA), it’s now possible to make a bar chart race in PowerPoint, too. Here’s an example.

[![Top grossing actors video](https://i.ytimg.com/vi/nqVVyOLUfa0/0.jpg)](https://youtu.be/nqVVyOLUfa0)

## Step-by-step guide to make Bar Chart Race in PowerPoint

Here’s a quick walk-through of the techniques we used to create this.

### Step 1: Create a 2-slide bar chart race

To create the animation, create two slides. In the first, add one rectangle per bar in the bar chart. Copy the slide to the second one, and move or re-size the bars. The result could look like this.

![Bar chart race slide 1](https://blog.gramener.com/wp-content/uploads/2019/07/Slide1-1024x576.png)

![Making bar chart race in PowerPoint](https://blog.gramener.com/wp-content/uploads/2019/07/Slide2-1024x576.png)

Under Transition, choose “Morph”. Pick a duration.

![Morph transition in PowerPoint](https://blog.gramener.com/wp-content/uploads/2019/07/image.png)

When you view it slideshow mode, this is what it looks like.

PowerPoint moves objects based on the text in the bar chart. You can add images. These will be moved too. Colors will be smoothly morphed.

[![Sample bar chart race in PowerPoint](https://i.ytimg.com/vi/uGQ0_opjmQE/0.jpg)](https://youtu.be/uGQ0_opjmQE)

[Download this Bar Chart Race PPTX to try it out](https://blog.gramener.com/wp-content/uploads/2019/07/tutorial-2.pptx)[Download](https://blog.gramener.com/wp-content/uploads/2019/07/tutorial-2.pptx)

### Step 2: Size the bars accurately

The reason we can’t just use a bar chart is that PowerPoint can’t morph bar charts. So the (painful) alternative is to manually create the bars.

A quick way is to scale the numbers by a convenient factor. For example, if Samuel Jackson’s box office gross is $6.5 billion, you can select the Shape Format and set the width to 6.5″. (You can select all the bars and scale them later.)

![Shape format option in Powerpoint](https://blog.gramener.com/wp-content/uploads/2019/07/image-1.png)

#### Create the Star Wars Intro Crawl

The ShapeChef blog has a step-by-step guide on [How to Create a Star Wars Intro Crawl](https://www.shapechef.com/blog/star-wars-intro-crawl-in-powerpoint-2013). This uses WordArt styles and 3D rotation to create something that mimics the Star Wars intro crawl.

![star wars data visualization](https://blog.gramener.com/wp-content/uploads/2019/07/star-wars-intro-crawl.jpg)

### Step 3: Record voiceover

PowerPoint’s Insert > Media > Audio > Record Audio… feature lets you [record your voice and insert it into the slide directly](https://support.office.com/en-us/article/Add-or-delete-audio-in-your-PowerPoint-presentation-C3B2A9FD-2547-41D9-9182-3DFAA58F1316). You can use Playback controls to trim the audio and fade in or out.

![Audio record option in powerpoint](https://blog.gramener.com/wp-content/uploads/2019/07/image-2.png)

I wrote down the script for each year and inserted the audio on every slide.

### Step 4: Auto-play the voiceover

Select the Start: “Automatically” option. This plays the audio as soon as the slide starts.

![autoplay the voiceover in PPT | bar chart race narrative in PowerPoint](https://blog.gramener.com/wp-content/uploads/2019/07/image-3.png)

To advance the slides automatically, select the Transition > Timing > Advance Slide > After option, and set it to _zero_. This will move to the next slide after all the animations (including audio) on the page are complete.

![transitions in PowerPoint](https://blog.gramener.com/wp-content/uploads/2019/07/image-5.png)

### Step 5: Add background music

You can find background music at [YouTube’s Audio Library](https://www.youtube.com/audiolibrary/music), [SoundCloud](https://soundcloud.com/), [Jamendo](https://www.jamendo.com/), etc. Download the audio, insert it in your first slide. Check Playback > Audio Options > Play across Slides. That will play the music in the background. (Reduce the volume, so that it’s not intrusive.)

### Step 6: Export as MPEG-4

PowerPoint can [save as MPEG-4 video](https://support.office.com/en-us/article/Save-a-presentation-as-a-movie-file-or-MP4-4e1ebcc1-f46b-47b6-922a-bac76c4a5691). For some reason, though, the output was jittery. So for my [final version](https://youtu.be/nqVVyOLUfa0), I used [Open Broadcaster Software (OBS)](https://obsproject.com/) instead and recorded the screen.

#### 99% perspiration

These techniques were quick to find. But the bulk of the time went into:

- Crafting an interesting story to tell — which included the titles, and finding the movies to support the title
- Settings the widths on every single one of the 40 slides
- Adding the photos against every bar and movie posters on every slide
- Adding animations against every movie poster
- Recording the voice-over on every slide

All-in-all, a fairly manual effort. For deployment, the automated scrolly-telling approach “[Box Office Mojo](https://gramener.com/enumter/box-office-mojo-actors/)” created by [Pratap](https://twitter.com/PratapVardhan) works much better.

_But we chose the manual approach consciously_. While prototyping, it allowed us to change course mid-way easily.
