// elements
const categoryDropDown = document.querySelector('#category');
const difficultyDropDown = document.querySelector('#difficulty');
const score = document.querySelector('#score');
const questionButton = document.querySelector('.next_btn');
const optionList = document.querySelector('.option_list');
const questiontext = document.querySelector('.question_text');
const title = document.querySelector('.title');
const info = document.querySelector('#info');
let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';

let correctTotal = 0;
let wrongTotal = 0;
let correctAnswer;

// Helper Function: to return option buttons 
const getOptions = (options) => {
    return options.map(option => `<div class="option"><span>${option}</span></div>`).join('<br>');
}

// Helper Function: to update correct and wrong total count
const updateLabel = () => {
    score.innerHTML = `Correct <strong>${correctTotal}</strong> Wrong <strong>${wrongTotal}</strong>`;
}

// Helper Function: to clear certain elements
const clearElements = () => {
    questiontext.innerHTML = '';
    optionList.innerHTML = '';
}

// Helper Function: shuffles an array, locates array elements in random order
const shuffleOptions = (options) => {
    return options.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
}

// Helper Function: to remove old question content
const resetQuestion = () => {
    clearElements();
    questionButton.style.display = 'block';
    // Changing Question Button Label if asked for dropdown change
    // questionButton.innerHTML = 'Get First Question';
}

// Handles response data for sucessfull API request
const handleData = (response) => {
    let question = response.results[0].question;
    correctAnswer = response.results[0].correct_answer.replace("&#039;","'");
    let incorrectAnswers = response.results[0].incorrect_answers;
    let options = [correctAnswer, ...incorrectAnswers];
    let shuffledOptions = shuffleOptions(options);
    questiontext.innerHTML += `<span>${question}</span>`;
    optionList.innerHTML += getOptions(shuffledOptions);
    const choises = optionList.querySelectorAll(".option");
    choises.forEach(choise => choise.addEventListener('click', validateOption));
}

const callAPI = (category, difficulty) => {
    const API_ENDPOINT = 'https://opentdb.com/api.php';
    // Request data from API
    $.ajax({
        url: `${API_ENDPOINT}?amount=1&category=${category}&difficulty=${difficulty}`,
        type: 'GET',
        dataType: 'json',
        success: handleData,
        error: function (jqXHR, textStatus, ex) {
            console.log(`${textStatus}, ${ex}, ${jqXHR.responseText}`);
            questionButton.style.display = 'block';
        }
    });
}

// validates option
const validateOption = (e) => {
    let currentAnswer = e.target.textContent;
    let answer = e.target;
    questionButton.innerHTML = 'Get Another Question';
    // if selected answer is correct
    if (currentAnswer.normalize() === correctAnswer.normalize()) {
        correctTotal++;
        updateLabel();
        answer.classList.add("correct"); // adding green background color to correct selected option
        answer.insertAdjacentHTML("beforeend", tickIconTag); // adding tick icon to correct selected option
        questionButton.style.display = 'block';
        return;
    } 

    // if selected answer is correct
    wrongTotal++;
    updateLabel();
    answer.classList.add("incorrect"); // adding red background color to selected option
    answer.insertAdjacentHTML("beforeend", crossIconTag); // adding cross icon to selected option
    let allOptions = optionList.getElementsByTagName('div');
    [...allOptions].forEach(option => {
        option.classList.add("disabled"); // once user selects an option then disable all options
        if (option.textContent === correctAnswer) {
            option.setAttribute("class", "option correct"); // adding green background color to matched option
            option.insertAdjacentHTML("beforeend", tickIconTag); // adding tick icon to matched option
        }
    });
    questionButton.style.display = 'block';
}

const getQuestion = () => {
    let category = categoryDropDown.value;
    let difficulty = difficultyDropDown.value;
    // Update category and difficulty label on footer
    var selectedValue = categoryDropDown.options[categoryDropDown.selectedIndex].text;
    info.innerHTML = `Quiz Question for category: <strong>${selectedValue}</strong> and difficulty level: <strong>${difficulty.toUpperCase()}</strong>`;
    // to hide questionButton until api call is succesfull
    questionButton.style.display = 'none';
    clearElements();
    callAPI(category, difficulty);
}

questionButton.addEventListener('click', getQuestion);
categoryDropDown.addEventListener('change', resetQuestion);
difficultyDropDown.addEventListener('change', resetQuestion);
