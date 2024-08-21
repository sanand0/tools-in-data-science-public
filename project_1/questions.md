## QUESTIONS

---

> [!NOTE] > **Vote share** is defined as votes of the candidate divided by the total votes in that election year expressed as a percentage.
>
> **Margin percentage** is the difference in the vote share between the winner and the runner up.
>
> If a candidate fails to secure at least 1/6th of the total votes in an election then they **lose their deposit**.
>
> **IND** represents **independent candidates** in the party column.
>
> Use standard rounding for questions that require answer in float.

---

### Quantative Questions

1. Identify the candidate who had the greatest change in vote share compared to the previous election,
   regardless of the gap between elections? [string]

   - Do not consider NOTA as candidate (but NOTA votes are to be considered as part of the total votes)
   - If no candidate has participated in two elections, then the answer will be NA
   - If two candidates have the same vote share change, choose the candidate who came first alphabetically

2. Which election year had the most female candidates contesting an election? [string]

   - If two or more years have the same number of female candidates, choose the latest year.
   - If there are no female contestants then answer will be NA.

3. Find the highest number of female candidates that contested a single election. [integer]

   - If there are no female contestants then answer will be 0.

4. What is the highest margin percentage by which the winning candidate has defeated the runner up in any election?
   Give your answer to 2 decimal places. [float]

5. In which year did the winning candidate have the biggest margin percentage win over the runner up? [string]

   - If there are two or more years with the same winning margin, choose the latest one

6. What is the largest difference in votes between the first and the last candidate? [integer]

7. In which year was the difference between the first and last candidates votes the biggest? [string]

   - If two or more years have the same difference in votes, then choose the latest year.

8. How many candidates lost their deposit across the entire dataset? [integer]

   - If there was only 1 candidate in an election, the candidate does not lose their deposit.
   - Don't consider NaN/NA/(blank) votes.
   - NOTA are not candidates

9. In how many elections did the winner get more than 50 percent of the vote? [integer]

10. What is the latest year in which the winner won more than 50 percent of the vote? [string]

    - If no one got more than 50 percent of the vote, then the answer is NA

11. Which party won the highest number of election in a given constituency? [string]

    - If two or more parties have the same number of highest wins, choose the party that is alphabetically first
    - If independent candidates won the highest number of elections then the answer is IND

12. If the second and the third candidate in an election combined their vote, how many elections would they win? [integer]

    - Do not count elections where there are less than 3 candidates, count these as 0

13. What is the average vote share of the winners across all elections? Give your answer to 2 decimal places. [float]

14. What percentage of elections did female candidates win, when there was at least one female candidate in that election? Give your answer to 2 decimal places. [float]

### Qualitative Questions

1. Plot the vote share of the winners and the runner up across all years. (If an election was uncontested or had only one candidate, the vote share is considered 100 percent). Try to identify any interesting findings or patterns and explain them using the underlying dataset.

2. Plot the aggregated votes of all women candidatates (the sum of all women candidate votes) in each election across all years. Also plot the total votes of each election across all years. Try to identify any interesting findings or patterns and explain them using the underlying dataset.
