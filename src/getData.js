const getData = (templateData) => {
    let state = {};
    const searchPanel = document.location.search;

    searchPanel.includes('theme=light')? state.theme = 'light' : state.theme = 'dark';

    const getSlideNum = (search) => {
        if (search.includes('slide=11')) {
            return 11
        } else if (search.includes('slide=10')) {
            return 10
        } else if (search.includes('slide=9')) {
            return 9
        } else if (search.includes('slide=8')) {
            return 8
        } else if (search.includes('slide=7')) {
            return 7
        } else if (search.includes('slide=6')) {
            return 6
        } else if (search.includes('slide=5')) {
            return 5
        } else if (search.includes('slide=4')) {
            return 4
        } else if (search.includes('slide=3')) {
            return 3
        } else if (search.includes('slide=2')) {
            return 2
        } else {
            return 1
        }
    }

    if ( searchPanel.includes('slide=')) {
        state.slide = getSlideNum(searchPanel);
    } else {
        state.slide = 1;
    }

    const alias = templateData[(state.slide - 1)].alias;
    const data = templateData[(state.slide - 1)].data;


    if (state.theme === 'dark') {
        document.body.classList.add('theme-dark')
        if (document.body.classList.contains('theme-light')) {
            document.body.classList.remove('theme-light')
        }
    } else {
        document.body.classList.add('theme-light')
        if (document.body.classList.contains('theme-dark')) {
            document.body.classList.remove('theme-dark')
        }
    }
    document.body.innerHTML = window.renderTemplate(alias , data);


    window.addEventListener('resize', () => {
        document.body.innerHTML = window.renderTemplate(alias, data);

    })




}

export default getData

