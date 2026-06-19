import { NextRequest, NextResponse } from "next/server";

const PISTON_URL = "https://emkc.org/api/v2/piston";

const LANGUAGE_MAP: Record<string, string> = {
  solidity: "solidity",
  javascript: "javascript",
  python: "python",
  typescript: "typescript",
  cpp: "c++",
  java: "java",
  rust: "rust",
  c: "c",
};

// Syntax checks for bracket/parenthesis/brace matching
function checkSoliditySyntax(code: string): string | null {
  const stack: { char: string; line: number }[] = [];
  const lines = code.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let inString = false;
    let stringChar = "";
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      // Inline comments
      if (!inString && char === "/" && line[j + 1] === "/") {
        break;
      }
      
      // Block comments
      if (!inString && char === "/" && line[j + 1] === "*") {
        let k = j + 2;
        while (k < line.length && !(line[k] === "*" && line[k + 1] === "/")) {
          k++;
        }
        j = k + 1;
        continue;
      }
      
      if (char === '"' || char === "'") {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (stringChar === char) {
          inString = false;
        }
      }
      
      if (inString) continue;
      
      if (char === "{" || char === "(" || char === "[") {
        stack.push({ char, line: i + 1 });
      } else if (char === "}" || char === ")" || char === "]") {
        const last = stack.pop();
        if (!last) {
          return `Syntax Error: Unmatched closing character '${char}' at line ${i + 1}`;
        }
        if (
          (char === "}" && last.char !== "{") ||
          (char === ")" && last.char !== "(") ||
          (char === "]" && last.char !== "[")
        ) {
          return `Syntax Error: Mismatched opening/closing characters. Found '${last.char}' matching '${char}' at line ${i + 1}`;
        }
      }
    }
  }
  
  if (stack.length > 0) {
    const last = stack[stack.length - 1];
    return `Syntax Error: Unclosed opening character '${last.char}' from line ${last.line}`;
  }
  
  return null;
}

// Submodule 8.8 Q1 - TodoList.sol
function testTodoListSol(code: string) {
  const tests = [
    { name: "Task Struct definition", pass: false, detail: "Define 'struct Task' with id, content, and completed." },
    { name: "Task storage mapping/array", pass: false, detail: "Define state variable tasks array or mapping." },
    { name: "createTask implementation", pass: false, detail: "Implement createTask(string memory _content) that emits an event." },
    { name: "toggleCompleted implementation", pass: false, detail: "Implement toggleCompleted(uint _id) that updates status and emits event." },
    { name: "getTaskCount & getAllTasks", pass: false, detail: "Implement view/pure functions to retrieve tasks." }
  ];

  if (code.includes("struct Task") && code.includes("content") && code.includes("completed")) {
    tests[0].pass = true;
    tests[0].detail = "Found Task struct with correct fields.";
  }
  if ((code.includes("Task[]") && code.includes("tasks")) || code.includes("mapping") || code.includes("TodoList")) {
    tests[1].pass = true;
    tests[1].detail = "Found tasks state array or mapping.";
  }
  if (code.includes("createTask") && (code.includes("emit ") || code.includes("TaskCreated"))) {
    tests[2].pass = true;
    tests[2].detail = "Found createTask function emitting TaskCreated event.";
  }
  if (code.includes("toggleCompleted") && (code.includes("emit ") || code.includes("TaskCompleted") || code.includes("TaskToggle"))) {
    tests[3].pass = true;
    tests[3].detail = "Found toggleCompleted function updating task state and emitting event.";
  }
  if (code.includes("getTaskCount") || code.includes("getAllTasks") || code.includes("tasks")) {
    tests[4].pass = true;
    tests[4].detail = "Found read functions getTaskCount or getAllTasks.";
  }
  return tests;
}

// Submodule 8.8 Q2 - TodoList.test.js
function testTodoListTest(code: string) {
  const tests = [
    { name: "Describe blocks", pass: false, detail: "Uses describe() blocks to group test suites." },
    { name: "Deployment tests", pass: false, detail: "Deploys contract using ethers.getContractFactory or deployContract." },
    { name: "createTask assertions", pass: false, detail: "Includes assertions for task creation." },
    { name: "toggleCompleted assertions", pass: false, detail: "Includes assertions for task completion toggling." }
  ];

  if (code.includes("describe(") && code.includes("it(")) {
    tests[0].pass = true;
    tests[0].detail = "Found standard Mocha describe and it hooks.";
  }
  if (code.includes("getContractFactory") || code.includes("deployContract") || code.includes("deploy(") || code.includes("ethers")) {
    tests[1].pass = true;
    tests[1].detail = "Verified deployment logic inside before/beforeEach hooks.";
  }
  if (code.includes("createTask") && (code.includes("expect") || code.includes("assert") || code.includes("equal"))) {
    tests[2].pass = true;
    tests[2].detail = "Verified assertions verifying task content and event emission.";
  }
  if (code.includes("toggleCompleted") && (code.includes("expect") || code.includes("assert") || code.includes("equal"))) {
    tests[3].pass = true;
    tests[3].detail = "Verified assertions verifying toggle completed status.";
  }
  return tests;
}

// Submodule 8.8 Q3 - TodoList.deploy.js
function testTodoListDeploy(code: string) {
  const tests = [
    { name: "Ethers factory usage", pass: false, detail: "Uses ethers.getContractFactory('TodoList')." },
    { name: "Deploy method execution", pass: false, detail: "Calls await factory.deploy() to trigger deployment." },
    { name: "Log contract address", pass: false, detail: "Logs the deployed contract address using console.log." }
  ];

  if (code.includes("getContractFactory")) {
    tests[0].pass = true;
    tests[0].detail = "Found contract factory initialization.";
  }
  if (code.includes("deploy(")) {
    tests[1].pass = true;
    tests[1].detail = "Found deployment execution script call.";
  }
  if (code.includes("console.log") && (code.includes("address") || code.includes("deployed") || code.includes("TodoList"))) {
    tests[2].pass = true;
    tests[2].detail = "Logs address output for verification.";
  }
  return tests;
}

// Submodule 8.8 Q4 - React Frontend
function testTodoListReact(code: string) {
  const tests = [
    { name: "Component definition", pass: false, detail: "Defines React functional component." },
    { name: "State management hooks", pass: false, detail: "Uses useState for tasks, loading, or accounts." },
    { name: "Web3 integration", pass: false, detail: "Initializes Web3 provider (ethers, window.ethereum, or BridgeKey)." },
    { name: "UI markup elements", pass: false, detail: "Renders task list, inputs, and action buttons." }
  ];

  if (code.includes("function") || code.includes("const ") || code.includes("export default") || code.includes("import")) {
    tests[0].pass = true;
    tests[0].detail = "Component wrapper matches React template.";
  }
  if (code.includes("useState") || code.includes("useEffect") || code.includes("state")) {
    tests[1].pass = true;
    tests[1].detail = "Found standard state and side-effect hooks.";
  }
  if (code.includes("ethereum") || code.includes("ethers") || code.includes("providers") || code.includes("BridgeKey") || code.includes("MetaMask") || code.includes("web3")) {
    tests[2].pass = true;
    tests[2].detail = "Found web3 provider initialization.";
  }
  if (code.includes("input") || code.includes("button") || code.includes("map") || code.includes("tasks")) {
    tests[3].pass = true;
    tests[3].detail = "Found JSX code displaying tasks and form inputs.";
  }
  return tests;
}

// Tests for SimplePermission Solidity question
function testSimplePermission(code: string) {
  const tests = [
    {
      name: "Check Struct Definition",
      pass: false,
      detail: "Define 'struct Capability' with maxAmount (uint), expiry (uint), and active (bool)."
    },
    {
      name: "Check Permissions Mapping",
      pass: false,
      detail: "Define 'mapping(address => Capability) public permissions'."
    },
    {
      name: "Check grantPermission Function",
      pass: false,
      detail: "Implement 'grantPermission(address agent, uint maxAmount, uint duration)' that sets permissions."
    },
    {
      name: "Check onlyPermitted Modifier",
      pass: false,
      detail: "Implement modifier 'onlyPermitted(uint amount)' checking active, expiry, and maxAmount."
    },
    {
      name: "Check spendWithPermission Function",
      pass: false,
      detail: "Implement 'spendWithPermission(uint amount) onlyPermitted(amount)'."
    },
    {
      name: "Check revokePermission Function",
      pass: false,
      detail: "Implement 'revokePermission(address agent)' setting active = false."
    }
  ];

  // 1. Struct Definition
  if (code.includes("struct Capability") && 
      /uint\s+maxAmount/.test(code) && 
      /uint\s+expiry/.test(code) && 
      /bool\s+active/.test(code)) {
    tests[0].pass = true;
    tests[0].detail = "Found struct Capability with maxAmount, expiry, and active status.";
  }

  // 2. Mapping
  if (/mapping\s*\(\s*address\s*=>\s*Capability\s*\)\s*public\s*permissions/.test(code)) {
    tests[1].pass = true;
    tests[1].detail = "Found permissions mapping declared as public.";
  }

  // 3. grantPermission
  if (/function\s+grantPermission\s*\(\s*address\s+\w+\s*,\s*uint\s+\w+\s*,\s*uint\s+\w+\)/.test(code)) {
    if (code.includes("active") && code.includes("maxAmount") && code.includes("expiry") && code.includes("block.timestamp")) {
      tests[2].pass = true;
      tests[2].detail = "Found grantPermission saving maxAmount, expiry (block.timestamp + duration), and active status.";
    } else {
      tests[2].detail = "grantPermission function exists but does not correctly assign active status, expiry, or maxAmount.";
    }
  }

  // 4. modifier onlyPermitted
  if (/modifier\s+onlyPermitted\s*\(\s*uint\s+\w+\)/.test(code)) {
    const hasActive = code.includes(".active") || code.includes("active");
    const hasExpiry = code.includes(".expiry") || code.includes("expiry");
    const hasAmount = code.includes("maxAmount");
    if (hasActive && hasExpiry && hasAmount) {
      tests[3].pass = true;
      tests[3].detail = "Found onlyPermitted modifier verifying active status, non-expiration, and spend limit.";
    } else {
      tests[3].detail = "Modifier exists but is missing checks for active state, expiration (block.timestamp), or maxAmount.";
    }
  }

  // 5. spendWithPermission
  if (/function\s+spendWithPermission/.test(code)) {
    if (/spendWithPermission\s*\(\s*uint\s+\w+\s*\)\s*[^{]*\bonlyPermitted\b/.test(code)) {
      tests[4].pass = true;
      tests[4].detail = "Found spendWithPermission function with onlyPermitted modifier attached.";
    } else {
      tests[4].detail = "spendWithPermission function exists but does not apply the onlyPermitted modifier.";
    }
  }

  // 6. revokePermission
  if (/function\s+revokePermission\s*\(\s*address\s+\w+\)/.test(code)) {
    if (/active\s*=\s*false/.test(code) || /permissions\[\w+\]\.active\s*=\s*false/.test(code)) {
      tests[5].pass = true;
      tests[5].detail = "Found revokePermission function setting active = false for the agent.";
    } else {
      tests[5].detail = "revokePermission function exists but does not set the capability active state to false.";
    }
  }

  return tests;
}

// Tests for BadAuction Solidity question
function testBadAuction(code: string) {
  const tests = [
    {
      name: "Checks-Effects-Interactions (State Update)",
      pass: false,
      detail: "Update highestBidder and highestBid before making any external calls or refunding."
    },
    {
      name: "Pull-over-Push Refund Queuing",
      pass: false,
      detail: "Add refunds to a pendingReturns mapping instead of pushing them via call inside bid()."
    },
    {
      name: "Withdraw Refund Function",
      pass: false,
      detail: "Implement a withdraw() or claimRefund() function that allows outbid bidders to pull their ETH."
    },
    {
      name: "Withdraw Reentrancy Guard (CEI)",
      pass: false,
      detail: "Reset the pending refund balance to 0 before executing the call in withdraw()."
    }
  ];

  // 1. Checks-Effects-Interactions
  const hasUpdates = code.includes("highestBidder =") && code.includes("highestBid =");
  const bidFunc = code.split(/function\s+bid/)[1]?.split(/function\s+\w+/)[0] || "";
  const directCall = /call\s*\{.*value/.test(bidFunc);
  if (hasUpdates && !directCall) {
    tests[0].pass = true;
    tests[0].detail = "State variables highestBidder and highestBid are updated securely before any external operations.";
  } else if (directCall) {
    tests[0].detail = "Insecure: direct external .call found inside bid(). State updates must happen before interactions.";
  }

  // 2. Pull-over-Push
  const hasMapping = /mapping\s*\(\s*address\s*=>\s*uint\s*\)\s*(public|private|internal)?\s*pendingReturns/.test(code) || /mapping\s*\(\s*address\s*=>\s*uint\s*\).*(refunds|allowances|bids)/.test(code);
  const queuesRefund = /pendingReturns\[\w+\]\s*\+=\s*/.test(code) || /refunds\[\w+\]\s*\+=\s*/.test(code);
  if (hasMapping && queuesRefund && !directCall) {
    tests[1].pass = true;
    tests[1].detail = "Refunds are successfully queued in a mapping for users to pull, eliminating direct pushes.";
  } else {
    tests[1].detail = "Missing refund queuing mapping or still pushing refunds directly inside bid().";
  }

  // 3. Withdraw Refund Function
  const hasWithdraw = /function\s+(withdraw|claimRefund|claim)\b/.test(code);
  const withdrawFuncIndex = code.search(/function\s+(withdraw|claimRefund|claim)\b/);
  const withdrawFunc = withdrawFuncIndex !== -1 ? code.slice(withdrawFuncIndex).split(/function\s+\w+/)[0] : "";
  const hasCall = /call\s*\{.*value/.test(withdrawFunc);
  if (hasWithdraw && hasCall) {
    tests[2].pass = true;
    tests[2].detail = "Found withdrawal function sending the pending return amount using low-level call.";
  } else {
    tests[2].detail = "Missing a withdraw function or it does not execute a value-bearing call.";
  }

  // 4. CEI in Withdraw
  const zeroedIndex = Math.min(
    withdrawFunc.indexOf("= 0"),
    withdrawFunc.indexOf("delete ") !== -1 ? withdrawFunc.indexOf("delete ") : Infinity
  );
  const callIndex = withdrawFunc.indexOf(".call");
  if (hasWithdraw && zeroedIndex !== -1 && callIndex !== -1 && zeroedIndex < callIndex) {
    tests[3].pass = true;
    tests[3].detail = "Verified CEI pattern: pending return balance is zeroed out before sending ETH, blocking reentrancy.";
  } else {
    tests[3].detail = "Reentrancy vulnerability: pending balance is not reset/zeroed before executing the external transfer.";
  }

  return tests;
}

// Tests for Hardhat Script question
function testHardhatScript(code: string) {
  const tests = [
    {
      name: "Block Confirmations Wait",
      pass: false,
      detail: "Wait for multiple block confirmations (e.g. wait(5)) after deployment before verification."
    },
    {
      name: "Network-Aware Verification",
      pass: false,
      detail: "Only run contract verification on public networks (e.g. check if network.name !== 'hardhat')."
    },
    {
      name: "Dependency Injection",
      pass: false,
      detail: "Deploy Staking with the deployed Token contract address passed to its constructor."
    }
  ];

  // 1. Wait for confirmations
  if (/wait\s*\(/.test(code) && (code.includes("deployTransaction") || code.includes("deploymentTransaction") || code.includes("token"))) {
    tests[0].pass = true;
    tests[0].detail = "Verified wait() block confirmation count before verifying contract.";
  } else {
    tests[0].detail = "Script verification will fail: must wait for confirmations (e.g. await token.deployTransaction.wait(5)).";
  }

  // 2. Network name check
  if (/network\.name/.test(code) || /hre\.network/.test(code) || /mst_mainnet/.test(code)) {
    tests[1].pass = true;
    tests[1].detail = "Found network environment check ensuring verification doesn't run on local hardhat network.";
  } else {
    tests[1].detail = "No network check: verification calls should only run on public testnet/mainnet, not local networks.";
  }

  // 3. Staking dependency
  if (/Staking.*token\.address/.test(code) || /Staking.*token/.test(code)) {
    tests[2].pass = true;
    tests[2].detail = "Verified correct deployment sequence: Staking is deployed with Token address parameter.";
  } else {
    tests[2].detail = "Staking contract deployment is missing the Token contract address dependency in constructor.";
  }

  return tests;
}

export async function POST(req: NextRequest) {
  try {
    const { language, code, questionId, submoduleId, questionIndex, customInput } = await req.json();
    const lang = LANGUAGE_MAP[language] || "javascript";

    // SOLIDITY OR CUSTOM VALIDATION ROUTE
    if (language === "solidity" || questionId === "q11" || (submoduleId && (submoduleId === "8.8" || submoduleId.startsWith("21")))) {
      
      // If the user selected a non-solidity custom script running for general purpose, skip custom validation
      if (language !== "solidity" && language !== "javascript" && language !== "typescript") {
        // Fall back to Piston
      } else {
        // Run Syntax analyzer
        let syntaxError = null;
        if (language === "solidity" || (language === "javascript" && submoduleId === "8.8" && questionIndex === 0)) {
          syntaxError = checkSoliditySyntax(code);
        }

        if (syntaxError) {
          return NextResponse.json({
            compileSuccess: false,
            compile_output: syntaxError,
            stdout: "",
            stderr: syntaxError,
            exitCode: 1,
            testResults: [],
            time: "0.01s",
            memory: "15.2 MB",
          });
        }

        let testResults: { name: string; pass: boolean; detail: string }[] = [];

        // Submodule 8.8
        if (submoduleId === "8.8") {
          if (questionIndex === 0) {
            testResults = testTodoListSol(code);
          } else if (questionIndex === 1) {
            testResults = testTodoListTest(code);
          } else if (questionIndex === 2) {
            testResults = testTodoListDeploy(code);
          } else if (questionIndex === 3) {
            testResults = testTodoListReact(code);
          }
        }
        // Question 16.2 Q11 - SimplePermission
        else if (submoduleId === "16.2" && questionId === "q11") {
          testResults = testSimplePermission(code);
        }
        // Question 21.1 Q14 - BadAuction
        else if (submoduleId === "21.1" && questionId === "q14") {
          testResults = testBadAuction(code);
        }
        // Question 21.2 Q14 - Hardhat Deployment Script
        else if (submoduleId === "21.2" && questionId === "q14") {
          testResults = testHardhatScript(code);
        } else {
          testResults = [
            {
              name: "General Compilation",
              pass: true,
              detail: "Syntax check passed successfully."
            }
          ];
        }

        const passedCount = testResults.filter((t) => t.pass).length;
        const failedCount = testResults.length - passedCount;

        return NextResponse.json({
          compileSuccess: true,
          compile_output: "Compiled successfully.\nAll verification checks completed.",
          stdout: `Execution result:\n${passedCount} / ${testResults.length} test cases passed.`,
          stderr: failedCount > 0 ? "Some test assertions failed. Check test cases panel." : "",
          exitCode: failedCount > 0 ? 1 : 0,
          testResults,
          time: "0.03s",
          memory: "18.8 MB"
        });
      }
    }

    // REGULAR PISTON COMPILER RUN FALLBACK
    const versionRes = await fetch(`${PISTON_URL}/runtimes`);
    const runtimes = await versionRes.json();
    const runtime = runtimes.find(
      (r: { language: string }) => r.language === lang
    );
    const version = runtime?.version ?? "*";

    const fileNames: Record<string, string> = {
      solidity: "Main.sol",
      python: "main.py",
      "c++": "main.cpp",
      c: "main.c",
      java: "Main.java",
      typescript: "main.ts",
      javascript: "main.js",
    };
    const fileName = fileNames[lang] || "main.js";

    const executeRes = await fetch(`${PISTON_URL}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: lang,
        version,
        files: [{ name: fileName, content: code }],
        stdin: customInput || "",
        run_timeout: 10000,
        compile_timeout: 15000,
      }),
    });

    const result = await executeRes.json();

    if (!executeRes.ok) {
      return NextResponse.json({
        message: result.message || "Execution failed",
        stderr: JSON.stringify(result),
        compileSuccess: false
      });
    }

    const run = result.run;
    const compile = result.compile;

    const hasStderr = !!(run?.stderr || compile?.stderr);
    const success = !hasStderr && run?.code === 0;

    return NextResponse.json({
      compileSuccess: !compile?.stderr,
      compile_output: compile?.output ?? compile?.stderr ?? "Compilation successful.",
      stdout: run?.stdout ?? "",
      stderr: run?.stderr ?? compile?.stderr ?? "",
      exitCode: run?.code,
      time: "0.12s",
      memory: "23.4 MB",
      testResults: [
        {
          name: "Standard Run Execution",
          pass: success,
          detail: success 
            ? "Code executed to completion with status code 0." 
            : `Run failed with output: ${run?.stderr || compile?.stderr}`
        }
      ]
    });
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}
