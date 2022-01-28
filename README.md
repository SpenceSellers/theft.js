# theft.js
Deno-based Javascript environment that makes stealing code even easier.

Just paste URLs directly into your code and theft.js will execute the code it finds at the URL.

## Usage
    deno run --allow-read --allow-net theft.ts example.theft
## Example theft.js code
    // Hello world. Stash your literals just wherever.
    const text = <https://pastebin.com/raw/8cvSxYWn>;
    console.log(text); // Outputs "Hello World"


    // Shuffling an array. theft.js prioritizes stealing code from accepted answers.
    <https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array>

    // Outputs "[2,4,6,3,5,1]"
    console.log(shuffle([1,2,3,4,5,6]))
    
## FAQ
### So the actual owner of one of these URLs could replace their content with something malicious, right? And it'd be executed?
Yup.

### Should I use this in production?
Absolutely, I can't see any downside.
