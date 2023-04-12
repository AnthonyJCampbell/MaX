# Guardian unit testing explanation

We have not written any unit tests (so far!) for `guardian.js`, as the functionality within the file:

- Contains too little logic, and so any UTs would to be too low-level - guardian handles app lifecycle behaviour
- Would take longer to write UTs for than the time having the UTs would save - lifecycle method regressions would most likely be picked up at a stage in development before UTs are run.
