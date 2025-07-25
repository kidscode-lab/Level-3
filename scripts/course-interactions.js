/**
 * KidsCode Lab - Course Interactions (Simplified)
 * Interactive elements: quizzes, demos, games, and educational activities
 * Works with existing presentation-engine
 */

// ============== INTERACTIVE COMPONENTS MANAGER ============== 
class CourseInteractions {
    constructor() {
        this.quizzes = new Map();
        this.demos = new Map();
        this.games = new Map();
        
        this.init();
    }
    
    init() {
        this.initQuizzes();
        this.initDemos();
        this.initGames();
        this.initExpandableContent();
        this.initTooltips();
        this.initCodeBlocks();
        this.initPythonConsole();
    }
    
    // ============== QUIZ SYSTEM ============== 
    initQuizzes() {
        const quizSections = document.querySelectorAll('.quiz-section');
        
        quizSections.forEach((section, index) => {
            const quiz = new InteractiveQuiz(section, `quiz-${index}`);
            this.quizzes.set(`quiz-${index}`, quiz);
        });
    }
    
    // ============== DEMO SYSTEM ============== 
    initDemos() {
        // Initialize calculator demos
        const calculators = document.querySelectorAll('.calculator-demo');
        calculators.forEach((calc, index) => {
            const demo = new CalculatorDemo(calc, `calc-${index}`);
            this.demos.set(`calc-${index}`, demo);
        });
        
        // Initialize other interactive demos
        const pythonDemos = document.querySelectorAll('.interactive-demo');
        pythonDemos.forEach((demo, index) => {
            if (!demo.querySelector('.calculator-demo')) { // Skip calculator demos
                const pythonDemo = new PythonDemo(demo, `demo-${index}`);
                this.demos.set(`demo-${index}`, pythonDemo);
            }
        });
    }
    
    // ============== GAME SYSTEM ============== 
    initGames() {
        // Data Type Detective Game
        const detectiveGames = document.querySelectorAll('.detective-game');
        detectiveGames.forEach((game, index) => {
            const detective = new DataTypeDetective(game, `detective-${index}`);
            this.games.set(`detective-${index}`, detective);
        });
        
        // Prediction Games
        const predictionGames = document.querySelectorAll('.prediction-game');
        predictionGames.forEach((game, index) => {
            const prediction = new PredictionGame(game, `prediction-${index}`);
            this.games.set(`prediction-${index}`, prediction);
        });
    }
    
    // ============== EXPANDABLE CONTENT ============== 
    initExpandableContent() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.expand-toggle')) {
                this.toggleExpandableSection(e.target.closest('.expand-toggle'));
            }
        });
    }
    
    toggleExpandableSection(button) {
        const panel = button.nextElementSibling;
        const icon = button.querySelector('.expand-icon');
        
        if (!panel) return;
        
        const isExpanded = panel.style.display === 'block';
        console.log(' ----- toggleExpandableSection:')
        console.log(' ----- isExpanded:', isExpanded)
        
        if (isExpanded) {
            panel.style.display = 'none';
            icon.textContent = '+';
            button.setAttribute('aria-expanded', 'false');
        } else {
            panel.style.display = 'block';
            icon.textContent = '−';
            button.setAttribute('aria-expanded', 'true');
        }

        console.log(' ----- panel.style.display:', panel.style.display)

        // Smooth scroll to keep button in view
        setTimeout(() => {
            button.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
    
    // ============== TOOLTIP SYSTEM ============== 
    initTooltips() {
        let tooltip = document.getElementById('tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'tooltip';
            tooltip.className = 'tooltip';
            document.body.appendChild(tooltip);
        }
        
        document.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('tooltip-trigger')) {
                this.showTooltip(e.target, tooltip);
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            if (e.target.classList.contains('tooltip-trigger')) {
                this.hideTooltip(tooltip);
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (tooltip.style.display === 'block') {
                tooltip.style.left = (e.pageX + 10) + 'px';
                tooltip.style.top = (e.pageY - 10) + 'px';
            }
        });
    }
    
    showTooltip(trigger, tooltip) {
        const text = trigger.getAttribute('data-tooltip');
        if (!text) return;
        
        tooltip.textContent = text;
        tooltip.style.display = 'block';
    }
    
    hideTooltip(tooltip) {
        tooltip.style.display = 'none';
    }
    
    // ============== CODE BLOCK ENHANCEMENTS ============== 
    initCodeBlocks() {
        // Copy functionality
        console.log('===== initCodeBlocks trigger')
        document.addEventListener('click', (e) => {
            if (e.target.closest('.copy-btn')) {
                this.copyCode(e.target.closest('.copy-btn'));
            }
        });
        console.log('===== going to call enhanceSyntaxHighlighting')
        // Syntax highlighting enhancement (if needed)
        this.enhanceSyntaxHighlighting();
    }
    
    copyCode(button) {
        // Find the code content
        const codeBlock = button.closest('.code-block');
        if (!codeBlock) return;
        
        const codeElement = codeBlock.querySelector('code') || codeBlock.querySelector('pre');
        if (!codeElement) return;
        
        const code = codeElement.textContent || codeElement.innerText;
        
        // Copy to clipboard
        if (navigator.clipboard) {
            navigator.clipboard.writeText(code).then(() => {
                this.showCopyFeedback(button, true);
            }).catch(() => {
                this.fallbackCopyText(code, button);
            });
        } else {
            this.fallbackCopyText(code, button);
        }
    }
    
    fallbackCopyText(text, button) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            this.showCopyFeedback(button, true);
        } catch (err) {
            this.showCopyFeedback(button, false);
        }
        
        document.body.removeChild(textarea);
    }
    
    showCopyFeedback(button, success) {
        const originalText = button.textContent;
        const originalBg = button.style.background;
        
        if (success) {
            button.textContent = '✅ Copied!';
            button.style.background = 'var(--color-success)';
        } else {
            button.textContent = '❌ Failed';
            button.style.background = 'var(--color-error)';
        }
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = originalBg;
        }, 2000);
    }
    
    enhanceSyntaxHighlighting() {
        // Add line numbers and enhanced highlighting if needed
        const codeBlocks = document.querySelectorAll('.code-block pre code');
        
        codeBlocks.forEach(code => {
            // Add data attributes for future enhancements
            code.setAttribute('data-enhanced', 'true');
        });
    }
    
    // ============== PYTHON CONSOLE SIMULATION ============== 
    initPythonConsole() {
        const consoles = document.querySelectorAll('.python-console');
        
        consoles.forEach((console, index) => {
            const simulator = new PythonConsoleSimulator(console, `console-${index}`);
            this.demos.set(`console-${index}`, simulator);
        });
    }
}

// ============== INTERACTIVE QUIZ CLASS ============== 
class InteractiveQuiz {
    constructor(container, id) {
        this.container = container;
        this.id = id;
        this.currentQuestion = 1;
        this.correctAnswers = 0;
        this.totalQuestions = 0;
        
        this.init();
    }
    
    init() {
        this.questions = this.container.querySelectorAll('.quiz-question');
        this.totalQuestions = this.questions.length;
        
        // Add event listeners to quiz options
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('quiz-option')) {
                this.selectAnswer(e.target);
            }
        });
    }
    
    selectAnswer(button) {
        const question = button.closest('.quiz-question');
        const feedback = question.querySelector('.quiz-feedback');
        const options = question.querySelectorAll('.quiz-option');
        const isCorrect = button.getAttribute('data-correct') === 'true' || 
                         button.onclick && button.onclick.toString().includes('true');
        
        // Disable all options
        options.forEach(opt => opt.disabled = true);
        
        // Show feedback
        if (isCorrect) {
            button.style.background = 'var(--color-success)';
            button.style.color = 'white';
            feedback.innerHTML = '✅ Correct! Well done!';
            feedback.style.color = 'var(--color-success)';
            this.correctAnswers++;
        } else {
            button.style.background = 'var(--color-error)';
            button.style.color = 'white';
            feedback.innerHTML = '❌ Not quite right. Review the lesson!';
            feedback.style.color = 'var(--color-error)';
            
            // Highlight correct answer
            options.forEach(opt => {
                const optIsCorrect = opt.getAttribute('data-correct') === 'true' || 
                                   opt.onclick && opt.onclick.toString().includes('true');
                if (optIsCorrect) {
                    opt.style.background = 'var(--color-success)';
                    opt.style.color = 'white';
                }
            });
        }
        
        // Move to next question or complete quiz
        setTimeout(() => {
            this.nextQuestion();
        }, 2500);
    }
    
    nextQuestion() {
        const currentQ = this.container.querySelector(`[data-question="${this.currentQuestion}"]`);
        
        if (this.currentQuestion < this.totalQuestions) {
            currentQ.style.display = 'none';
            this.currentQuestion++;
            const nextQ = this.container.querySelector(`[data-question="${this.currentQuestion}"]`);
            if (nextQ) nextQ.style.display = 'block';
        } else {
            currentQ.style.display = 'none';
            this.completeQuiz();
        }
    }
    
    completeQuiz() {
        const completion = this.container.querySelector('.quiz-complete');
        if (completion) {
            completion.style.display = 'block';
            
            // Update completion text with score
            const scoreText = completion.querySelector('p');
            if (scoreText && this.totalQuestions > 1) {
                const percentage = Math.round((this.correctAnswers / this.totalQuestions) * 100);
                scoreText.textContent = `You scored ${this.correctAnswers}/${this.totalQuestions} (${percentage}%)! Ready for the next section?`;
            }
        }
        
        // Mark section as completed if course engine is available
        if (window.courseEngine) {
            window.courseEngine.markSectionComplete(
                window.courseEngine.currentLesson,
                window.courseEngine.currentSection
            );
        }
    }
}

// ============== CALCULATOR DEMO CLASS ============== 
class CalculatorDemo {
    constructor(container, id) {
        this.container = container;
        this.id = id;
        
        this.init();
    }
    
    init() {
        const input = this.container.querySelector('#mathInput, .calc-field');
        const button = this.container.querySelector('.level-button, .calc-button');
        const result = this.container.querySelector('#mathResult, .calc-result');
        
        if (input && button && result) {
            button.addEventListener('click', () => this.calculate(input, result));
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.calculate(input, result);
                }
            });
        }
    }
    
    calculate(input, result) {
        const expression = input.value.trim();
        
        if (!expression) {
            result.innerHTML = '<div class="calc-error">Please enter a math expression</div>';
            return;
        }
        
        try {
            // Sanitize input - only allow safe math operations
            const sanitized = expression.replace(/[^0-9+\-*/().% ]/g, '');
            
            if (sanitized !== expression) {
                throw new Error('Invalid characters detected');
            }
            
            // Evaluate the expression
            const answer = this.safeEval(sanitized);
            result.innerHTML = `<div class="calc-success">Result: <strong>${answer}</strong></div>`;
            
        } catch (error) {
            result.innerHTML = '<div class="calc-error">Please enter a valid math expression (e.g., 5 + 3 * 2)</div>';
        }
    }
    
    safeEval(expression) {
        // Simple safe evaluation for basic math
        // Avoid using eval() for security
        return Function(`"use strict"; return (${expression})`)();
    }
}

// ============== DATA TYPE DETECTIVE GAME ============== 
class DataTypeDetective {
    constructor(container, id) {
        this.container = container;
        this.id = id;
        this.values = [
            { value: '42', type: 'int', display: '42' },
            { value: '3.14', type: 'float', display: '3.14' },
            { value: '"Hello"', type: 'str', display: '"Hello"' },
            { value: 'True', type: 'bool', display: 'True' },
            { value: '-17', type: 'int', display: '-17' },
            { value: '"123"', type: 'str', display: '"123"' },
            { value: 'False', type: 'bool', display: 'False' },
            { value: '0.5', type: 'float', display: '0.5' },
            { value: '0', type: 'int', display: '0' },
            { value: '"Python"', type: 'str', display: '"Python"' }
        ];
        this.currentIndex = 0;
        this.score = 0;
        this.maxQuestions = 5;
        
        this.init();
    }
    
    init() {
        this.shuffleValues();
        this.setupQuestion();
        
        // Add event listeners
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('type-btn')) {
                this.guessType(e.target.getAttribute('data-type') || e.target.textContent.toLowerCase());
            }
        });
    }
    
    shuffleValues() {
        // Fisher-Yates shuffle
        for (let i = this.values.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.values[i], this.values[j]] = [this.values[j], this.values[i]];
        }
    }
    
    setupQuestion() {
        const questionValue = this.container.querySelector('#questionValue, .question-value');
        const scoreElement = this.container.querySelector('#detectorScore, .detective-score span');
        
        if (questionValue && this.currentIndex < this.values.length && this.currentIndex < this.maxQuestions) {
            questionValue.textContent = this.values[this.currentIndex].display;
        }
        
        if (scoreElement) {
            scoreElement.textContent = this.score;
        }
        
        // Reset buttons
        const buttons = this.container.querySelectorAll('.type-btn');
        buttons.forEach(btn => {
            btn.disabled = false;
            btn.style.background = '';
            btn.style.color = '';
        });
        
        // Clear feedback
        const feedback = this.container.querySelector('.detective-feedback');
        if (feedback) feedback.innerHTML = '';
    }
    
    guessType(guessed) {
        const correct = this.values[this.currentIndex].type;
        const feedback = this.container.querySelector('.detective-feedback');
        const buttons = this.container.querySelectorAll('.type-btn');
        
        // Disable all buttons
        buttons.forEach(btn => btn.disabled = true);
        
        // Show feedback
        if (guessed === correct) {
            this.score++;
            if (feedback) {
                feedback.innerHTML = '✅ Correct! Well done!';
                feedback.style.color = 'var(--color-success)';
            }
            
            // Highlight correct button
            buttons.forEach(btn => {
                if ((btn.getAttribute('data-type') || btn.textContent.toLowerCase()) === correct) {
                    btn.style.background = 'var(--color-success)';
                    btn.style.color = 'white';
                }
            });
        } else {
            if (feedback) {
                feedback.innerHTML = `❌ Not quite! This is a ${correct}.`;
                feedback.style.color = 'var(--color-error)';
            }
            
            // Highlight wrong and correct buttons
            buttons.forEach(btn => {
                const btnType = btn.getAttribute('data-type') || btn.textContent.toLowerCase();
                if (btnType === guessed) {
                    btn.style.background = 'var(--color-error)';
                    btn.style.color = 'white';
                } else if (btnType === correct) {
                    btn.style.background = 'var(--color-success)';
                    btn.style.color = 'white';
                }
            });
        }
        
        // Update score display
        const scoreElement = this.container.querySelector('#detectorScore, .detective-score span');
        if (scoreElement) {
            scoreElement.textContent = this.score;
        }
        
        // Move to next question
        setTimeout(() => {
            this.currentIndex++;
            if (this.currentIndex < this.maxQuestions && this.currentIndex < this.values.length) {
                this.setupQuestion();
            } else {
                this.endGame();
            }
        }, 2000);
    }
    
    endGame() {
        const percentage = Math.round((this.score / this.maxQuestions) * 100);
        const gameDiv = this.container.querySelector('.detective-question');
        
        if (gameDiv) {
            gameDiv.innerHTML = `
                <div class="game-complete">
                    <h4>🎉 Detective Game Complete!</h4>
                    <p>You identified ${this.score} out of ${this.maxQuestions} data types correctly (${percentage}%)!</p>
                    <button class="level-button" onclick="location.reload()">Play Again</button>
                </div>
            `;
        }
    }
}

// ============== PREDICTION GAME CLASS ============== 
class PredictionGame {
    constructor(container, id) {
        this.container = container;
        this.id = id;
        this.questions = [
            {
                code: '"Python" + "Rocks"',
                options: ['Python Rocks', 'PythonRocks', 'Error'],
                correct: 1
            },
            {
                code: '"Ha" * 3',
                options: ['HaHaHa', 'Ha3', 'Error'],
                correct: 0
            },
            {
                code: '5 + "3"',
                options: ['53', '8', 'Error'],
                correct: 2
            }
        ];
        this.currentQuestion = 0;
        this.score = 0;
        
        this.init();
    }
    
    init() {
        this.setupQuestion();
        
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('prediction-btn')) {
                const index = Array.from(e.target.parentElement.children).indexOf(e.target);
                this.checkPrediction(e.target, index === this.questions[this.currentQuestion].correct);
            }
        });
    }
    
    setupQuestion() {
        if (this.currentQuestion >= this.questions.length) {
            this.endGame();
            return;
        }
        
        const question = this.questions[this.currentQuestion];
        const codeBlock = this.container.querySelector('.code-block code');
        const options = this.container.querySelectorAll('.prediction-btn');
        
        if (codeBlock) {
            codeBlock.innerHTML = this.highlightSyntax(question.code);
        }
        
        options.forEach((btn, index) => {
            if (question.options[index]) {
                btn.textContent = question.options[index];
                btn.disabled = false;
                btn.style.background = '';
                btn.style.color = '';
            }
        });
        
        // Clear feedback
        const feedback = this.container.querySelector('.prediction-feedback');
        if (feedback) feedback.innerHTML = '';
    }
    
    highlightSyntax(code) {
        return code
            .replace(/"([^"]*)"/g, '<span class="code-string">"$1"</span>')
            .replace(/\b(\d+)\b/g, '<span class="code-number">$1</span>')
            .replace(/([+*/-])/g, '<span class="code-operator">$1</span>');
    }
    
    checkPrediction(button, isCorrect) {
        const buttons = this.container.querySelectorAll('.prediction-btn');
        const feedback = this.container.querySelector('.prediction-feedback');
        const correctIndex = this.questions[this.currentQuestion].correct;
        
        // Disable all buttons
        buttons.forEach(btn => btn.disabled = true);
        
        // Show result
        if (isCorrect) {
            this.score++;
            button.style.background = 'var(--color-success)';
            button.style.color = 'white';
            if (feedback) {
                feedback.innerHTML = '✅ Correct! Great prediction!';
                feedback.style.color = 'var(--color-success)';
            }
        } else {
            button.style.background = 'var(--color-error)';
            button.style.color = 'white';
            
            // Highlight correct answer
            buttons[correctIndex].style.background = 'var(--color-success)';
            buttons[correctIndex].style.color = 'white';
            
            if (feedback) {
                feedback.innerHTML = '❌ Not quite right. The correct answer is highlighted.';
                feedback.style.color = 'var(--color-error)';
            }
        }
        
        // Move to next question
        setTimeout(() => {
            this.currentQuestion++;
            this.setupQuestion();
        }, 3000);
    }
    
    endGame() {
        const percentage = Math.round((this.score / this.questions.length) * 100);
        this.container.innerHTML = `
            <div class="game-complete">
                <h4>🎯 Prediction Challenge Complete!</h4>
                <p>You predicted ${this.score} out of ${this.questions.length} correctly (${percentage}%)!</p>
                <button class="level-button" onclick="location.reload()">Try Again</button>
            </div>
        `;
    }
}

// ============== PYTHON DEMO CLASS ============== 
class PythonDemo {
    constructor(container, id) {
        this.container = container;
        this.id = id;
        
        this.init();
    }
    
    init() {
        const runButton = this.container.querySelector('.level-button');
        const output = this.container.querySelector('.demo-output, #demoOutput');
        
        if (runButton && output) {
            runButton.addEventListener('click', () => this.runDemo(runButton, output));
        }
    }
    
    runDemo(button, output) {
        const originalText = button.textContent;
        button.textContent = 'Running...';
        button.disabled = true;
        
        // Simulate Python execution
        setTimeout(() => {
            const resultDiv = output.querySelector('.output-result, #outputResult');
            if (resultDiv) {
                resultDiv.style.display = 'block';
            } else {
                // Create result if it doesn't exist
                const newResult = document.createElement('div');
                newResult.className = 'output-result';
                newResult.innerHTML = `
                    <strong>Output:</strong><br>
                    Hello, World! I'm learning Python!<br>
                    Math in Python: 5 + 3 = 8
                `;
                output.appendChild(newResult);
            }
            
            button.textContent = 'Run Again!';
            button.disabled = false;
        }, 1500);
    }
}

// ============== PYTHON CONSOLE SIMULATOR ============== 
class PythonConsoleSimulator {
    constructor(container, id) {
        this.container = container;
        this.id = id;
        this.history = [];
        
        this.init();
    }
    
    init() {
        const input = this.container.querySelector('#consoleInput, .console-input input');
        const runButton = this.container.querySelector('.run-btn');
        const clearButton = this.container.querySelector('.console-clear');
        
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.runCommand();
                }
            });
        }
        
        if (runButton) {
            runButton.addEventListener('click', () => this.runCommand());
        }
        
        if (clearButton) {
            clearButton.addEventListener('click', () => this.clearConsole());
        }
        
        // Setup suggestion buttons
        const suggestions = this.container.parentElement?.querySelectorAll('.suggestion-btn');
        if (suggestions) {
            suggestions.forEach(btn => {
                btn.addEventListener('click', () => {
                    const command = btn.textContent;
                    if (input) input.value = command;
                });
            });
        }
    }
    
    runCommand() {
        const input = this.container.querySelector('#consoleInput, .console-input input');
        const console = this.container.querySelector('#pythonConsole, .console-content');
        
        if (!input || !console) return;
        
        const command = input.value.trim();
        if (!command) return;
        
        // Add command to console
        this.addToConsole(console, `>>> ${command}`, 'console-command');
        
        // Process command and show result
        try {
            const result = this.simulatePython(command);
            this.addToConsole(console, result, 'console-output');
        } catch (error) {
            this.addToConsole(console, `Error: ${error.message}`, 'console-error');
        }
        
        // Clear input and scroll to bottom
        input.value = '';
        console.scrollTop = console.scrollHeight;
        
        // Add to history
        this.history.push(command);
    }
    
    addToConsole(console, text, className) {
        const line = document.createElement('div');
        line.className = 'console-line';
        
        if (className === 'console-command') {
            line.innerHTML = `<span class="prompt">>>> </span><span class="${className}">${text.substring(4)}</span>`;
        } else {
            line.innerHTML = `<span class="${className}">${text}</span>`;
        }
        
        console.appendChild(line);
    }
    
    simulatePython(command) {
        // Simple Python command simulation
        
        // Math operations
        if (command.match(/^\d+\s*[\+\-\*/]\s*\d+$/)) {
            return this.safeEval(command).toString();
        }
        
        // String concatenation
        if (command.match(/^".*"\s*\+\s*".*"$/)) {
            const parts = command.match(/"([^"]*)"\s*\+\s*"([^"]*)"/);
            return `"${parts[1]}${parts[2]}"`;
        }
        
        // String repetition
        if (command.match(/^".*"\s*\*\s*\d+$/)) {
            const parts = command.match(/"([^"]*)"\s*\*\s*(\d+)/);
            return `"${parts[1].repeat(parseInt(parts[2]))}"`;
        }
        
        // Boolean values
        if (command === 'True' || command === 'False') {
            return command;
        }
        
        // Print statements
        if (command.startsWith('print(')) {
            const content = command.match(/print\((.+)\)/);
            if (content) {
                return this.evaluatePrintContent(content[1]);
            }
        }
        
        // Variable assignment (simple)
        if (command.match(/^\w+\s*=\s*.+$/)) {
            return ''; // No output for assignments
        }
        
        // Help command
        if (command === 'help()') {
            return 'Welcome to Python! Try simple math like 5+3 or strings like "Hello"+"World"';
        }
        
        throw new Error('Unsupported command for this demo. Try math operations or string operations!');
    }
    
    evaluatePrintContent(content) {
        // Remove quotes if it's a string literal
        if (content.startsWith('"') && content.endsWith('"')) {
            return content.slice(1, -1);
        }
        
        // Try to evaluate as math
        try {
            return this.safeEval(content).toString();
        } catch {
            return content;
        }
    }
    
    safeEval(expression) {
        // Simple safe evaluation
        const sanitized = expression.replace(/[^0-9+\-*/().% ]/g, '');
        if (sanitized !== expression) {
            throw new Error('Invalid characters');
        }
        return Function(`"use strict"; return (${sanitized})`)();
    }
    
    clearConsole() {
        const console = this.container.querySelector('#pythonConsole, .console-content');
        if (console) {
            console.innerHTML = `
                <div class="console-line">
                    <span class="prompt">>>> </span>
                    <span class="console-text">Console cleared. Ready for new commands!</span>
                </div>
            `;
        }
        this.history = [];
    }
}

// ============== GLOBAL FUNCTIONS FOR HTML COMPATIBILITY ============== 

// Quiz functions
function selectAnswer(button, isCorrect) {
    // Legacy support - the new system handles this automatically
    const quiz = button.closest('.quiz-section');
    if (quiz && window.courseInteractions) {
        const quizId = Array.from(document.querySelectorAll('.quiz-section')).indexOf(quiz);
        const quizInstance = window.courseInteractions.quizzes.get(`quiz-${quizId}`);
        if (quizInstance) {
            button.setAttribute('data-correct', isCorrect.toString());
            quizInstance.selectAnswer(button);
        }
    }
}

function selectQuizAnswer(button, isCorrect) {
    selectAnswer(button, isCorrect);
}

// Game functions
function guessType(type) {
    const game = event.target.closest('.detective-game');
    if (game && window.courseInteractions) {
        const gameId = Array.from(document.querySelectorAll('.detective-game')).indexOf(game);
        const gameInstance = window.courseInteractions.games.get(`detective-${gameId}`);
        if (gameInstance) {
            event.target.setAttribute('data-type', type);
            gameInstance.guessType(type);
        }
    }
}

function checkPrediction(button, isCorrect) {
    const game = button.closest('.prediction-game');
    if (game && window.courseInteractions) {
        const gameId = Array.from(document.querySelectorAll('.prediction-game')).indexOf(game);
        const gameInstance = window.courseInteractions.games.get(`prediction-${gameId}`);
        if (gameInstance) {
            gameInstance.checkPrediction(button, isCorrect);
        }
    }
}

// Demo functions
function runDemo() {
    const demo = event.target.closest('.interactive-demo');
    if (demo && window.courseInteractions) {
        const demoId = Array.from(document.querySelectorAll('.interactive-demo')).indexOf(demo);
        const demoInstance = window.courseInteractions.demos.get(`demo-${demoId}`);
        if (demoInstance && demoInstance.runDemo) {
            const output = demo.querySelector('.demo-output, #demoOutput');
            demoInstance.runDemo(event.target, output);
        }
    }
}

function calculateMath() {
    const demo = event.target.closest('.calculator-demo, .interactive-demo');
    if (demo && window.courseInteractions) {
        const demoId = Array.from(document.querySelectorAll('.calculator-demo, .interactive-demo')).indexOf(demo);
        const demoInstance = window.courseInteractions.demos.get(`calc-${demoId}`) || 
                           window.courseInteractions.demos.get(`demo-${demoId}`);
        if (demoInstance && demoInstance.calculate) {
            const input = demo.querySelector('#mathInput, .calc-field');
            const result = demo.querySelector('#mathResult, .calc-result');
            demoInstance.calculate(input, result);
        }
    }
}

// Console functions
function runConsoleCommand() {
    const console = event.target.closest('.python-console');
    if (console && window.courseInteractions) {
        const consoleId = Array.from(document.querySelectorAll('.python-console')).indexOf(console);
        const consoleInstance = window.courseInteractions.demos.get(`console-${consoleId}`);
        if (consoleInstance) {
            consoleInstance.runCommand();
        }
    }
}

function clearConsole() {
    const console = event.target.closest('.python-console');
    if (console && window.courseInteractions) {
        const consoleId = Array.from(document.querySelectorAll('.python-console')).indexOf(console);
        const consoleInstance = window.courseInteractions.demos.get(`console-${consoleId}`);
        if (consoleInstance) {
            consoleInstance.clearConsole();
        }
    }
}

function fillConsole(command) {
    const console = event.target.closest('.python-console').parentElement || 
                   document.querySelector('.python-console');
    if (console) {
        const input = console.querySelector('#consoleInput, .console-input input');
        if (input) input.value = command;
    }
}

// Copy function
function copyCode(button) {
    if (window.courseInteractions) {
        window.courseInteractions.copyCode(button);
    }
}

// Expandable content
function toggleExpand(button) {
    if (window.courseInteractions) {
        window.courseInteractions.toggleExpandableSection(button);
    }
}

// ============== INITIALIZATION ============== 

// Initialize interactions when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for course engine to load first
    setTimeout(() => {
        window.courseInteractions = new CourseInteractions();
        
        console.log('🎮 Course Interactions loaded!');
        
        // Debug helpers
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            window.debugInteractions = () => {
                console.log('Quizzes:', window.courseInteractions.quizzes);
                console.log('Demos:', window.courseInteractions.demos);
                console.log('Games:', window.courseInteractions.games);
            };
        }
    }, 100);
});