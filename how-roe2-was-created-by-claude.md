# How ROE2 was created by Claude

For the May 25 ROE assessment, we had to create a new set of questions for some students who had to do a retake. The process we followed is outlined below. 

- The first step was clone the entire exam repository so that the GPT had access to all the existing questions, the structure of the exam files and style of questions.
- We used Claude Sonnet 4 as the AI model to assist us in generating and verifying the questions. 
- We gave Claude a little help by explaining the structure of the repo and indicating in which files the existing question bank were located and where the exam questions were located. The existing question bank includes easier GA questions but gives Claude an understanding of the breadth of the topics being covered.
- The AI was also given agentic access to the terminal so that it can run its own tests and verify the questions it created. This is important otherwise it may not be able to easily verify the questions it created.
- These were the prompts we used:

<prompt>
There are programming questions for assessments that are found in files named with the prefix `q-`. Examine all these questions and come up with 8 similar new ones in the same style and covering the same content. These are to have the same difficulty level as seen in the files prefixed by `exam-`.
Each of these new questions have to also be prefixed files with `q-`.
</prompt>

Next when creating the actual exam file, we asked it reuse an existing exam file as the template. This was to reduce the chances of formatting errors or introducing new bugs. (We later manually copied out the exam files and questions and refactored any naming changes as requried).
<prompt>
Can you replace the existing questions in `exam-tds-2025-roe2.js` with the newly created questions
</prompt>

A cross check is always necssary to ensure that questions are being rexamined. This check is not too dissimilar to humans rechecking their own work, and since both humans and AI can make mistakes, and there is a degree of uncertainty in the quality of the work in each iteration, cross checks dramatically reduce the incidence of errors. The important part here is to give abililty for the AI to be able to run its own tests in the terminal so that it can verify its own work. This step uncovered 3 mistakes in the 8 questions it created.
<prompt>
Also cross check and verify carefully that the new questions are logically correct and there are no errors in the script. Run local tests in the terminal to ensure that these are performing with expected results
</prompt>

Most answers that students generate tend to be using python, so it is important to ensure that the questions can be solved using python as well. This is especially important for data analysis questions where the libraries and functions used in python and javascript may differ.
<prompt>
Can you also verify the questions the new js questions with a python solution script to ensure that students solving the question using python will also get the same answers.
</prompt>

Our own interal workflow prefers the use of `uv` to run python scripts instead of installing pip packages. This is to ensure that the environment is clean, reproducible and that there are no dependency failures.
<prompt>
Do not install pip packages. Always use uv instead to run python scripts. Examples of how to run python scripts using uv for dependencies are given in the documentation https://docs.astral.sh/uv/guides/scripts/#declaring-script-dependencies
</prompt>

Finally, we had to make some corrections to the questions after reviewing them manually by attempting to answer them ourselves. These were mostly minor clarifications or adding tolerance ranges to account for rounding errors.
<prompt>
Can you make a change to the q-calculate-variance to clarify if sample or population variance is expected. Also allow for a some reasonable tolerance range for the answer to account for rounding errors.
</prompt>

<prompt>
Add a tolerance for `q-sales-data-analysis` question as well to account for small rounding errors
</prompt>

And thats it! The entire process took about one and a half hours including the time taken to review and make corrections. The AI did most of the heavy lifting and we just had to do some light supervision and review. When you look at the complexity of the dynamically generated questions and its corresponding dynamically generated datasets, the quality of the questions, validation testing and solution scripts, it is quite impressive that this was all done in such a short time frame.