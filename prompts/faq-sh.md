# faq.sh updates, 2 Nov 2025

<!--

Token usage: total=334,858 input=274,736 (+ 5,505,024 cached) output=60,122 (reasoning 42,816)
To continue this session, run codex resume 019a4479-e9ee-7b90-95e0-0063190081f2

-->

> Run live-sessions/faq.sh to get all new live sessions. It will fail for some videos that are too long. Note these. Rewrite the script to split videos into shorter
> chunks (with a 10 second overlap) using ffmpeg, maybe each not more than 1 hour, and get them working.

Then:

> Review the code for any errors or inconsistencies and fix them. Remove any redundant code.
> Identify the code chunks where comments will clarify functionality. Follow the style of existing comments. Just reading the comments should explain the flow.
> We want the .opus files to be saved as live-sessions/yyyymmdd-videoid.opus and the .md files as live-sessions/yyyymmdd-videoid.md. Make sure that happens. Delete any unnecessary files created.
> Make sure that we don't create too many chunks. 1 hour chunks are fine. Going down to 30 min is fine but probably not needed. Less is definitely not required.
> Once run successfully, the next run should be very fast, since most content is cached. Verify that.
>
> Create a plan for the above steps and execute it.

Then:

> Add comments in each paragraph of main() explaining what the paragraph of code does

Then:

> Document the usage clearly at the top of faq.sh
