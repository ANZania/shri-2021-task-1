'use strict'

import Chart from 'chart.js';
import templateData from './data.json';
import getData from "./getData";


window.renderTemplate = function(alias, data) {

    let layout = '';
    let avatars = [];
    let theme;
    let heatmapBlocks = [];
    let buttons = [];
    let orientation;

    const importAll = (context, output) => {
        context.keys().forEach((element, index) => {
            output[index] = context(element)
        });
    }

    const defineOrientation = () => {
        const clientWidth = window.innerWidth;
        const clientHeight = window.innerHeight;
        clientWidth < clientHeight ?
            orientation = 'vertical' :
            orientation = 'horizontal';
    }

    const setRowHeight = () => {
        if (alias === 'activity') {
            const heatmapBlock = document.querySelector('.min');
            const heatmapRows = document.querySelectorAll('.heatmap-row');

            const height = heatmapBlock.clientHeight;
            heatmapRows.forEach(element => {
                element.style.height = (height * 0.363695) + 'px'
            })

        }
    }

    const setWrapperPosition = () => {
        if (alias === 'chart') {
            const wrapper = document.body.querySelector('.chart-wrapper');
            const wrapperWidth = wrapper.offsetWidth;
            const width = window.innerWidth;

            const rightValue = (width - wrapperWidth)/2;

            wrapper.style.right =  rightValue + 'px'
        } else if (alias === 'diagram') {
            const colors = [];


            let values = [];
            for (let i = 0; i < data.categories.length; i++) {
                const parts = data.categories[i].valueText.split(' ');
                values.push(parts[0]);
            }

            if (theme === 'dark') {
                colors.push('rgba(255, 163, 0, 0.8)',
                            'rgba(99, 63, 0, 0.5)',
                            'rgba(155, 155, 155, 0.5)',
                            'rgba(77, 77, 77, 0.5)');
            } else {
                colors.push('rgba(191, 191, 191, 0.345)',
                            'rgba(166, 166, 166, 0.1725)',
                            'rgba(255, 184, 0, 0.24)',
                            'rgba(255, 184, 0, 0.56)');
            }

            const ctx = document.getElementById('doughnut-chart').getContext('2d');
            const diagram = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: values,
                        backgroundColor: colors,
                        borderWidth: 0
                    }]
                },
                options: {
                    cutoutPercentage: 70,
                    rotation: (-2/3) * Math.PI,
                }
            });
        }
        setRowHeight();
    }

    if (document.body.classList.contains('theme-light')) {
        theme = 'light'
    } else {
        theme = 'dark'
    }

    defineOrientation();
    importAll(require.context('./img/avatars/', true, /\.jpg$/), avatars);
    importAll(require.context('./img/elements/button/', true, /\.svg$/), buttons);
    window.onload = setWrapperPosition;

    const selectedUserId = data.selectedUserId;

    const setIMG = (id) => {
        if (id) {
            return avatars[id-1]
        } else {
            return avatars[12]
        }
    }

    if (alias === 'leaders') {
        let users = [];
        let emoji = [];
        let selectedUserPlace;

        const getEmoji = () => {
            emoji.push({
                status: 'first',
                emoji: data.emoji
            });
            selectedUserId ? emoji.push({
                status: 'selected',
                emoji: '👍'
            }) : '';
        };
        const setEmoji = (status) => {
            let response;
            emoji.forEach(element => {
                if (element.status === status) {
                    response = element.emoji;
                }
            })
            if (response) {
                return (response)
            } else {
                return ('')
            }
        };

        const setUsers = () => {
            let counterPlace = 0;
            for (let index = 0; index < data.users.length; index++) {
                counterPlace++;
                if (index < 5) {
                    if (data.users[index].id === selectedUserId) {
                        selectedUserPlace = counterPlace;
                        users.push({
                            place: counterPlace,
                            isSelected: true,
                            data: data.users[index]
                        })
                    } else {
                        users.push({
                            place: counterPlace,
                            isSelected: false,
                            data: data.users[index]
                        })
                    }
                } else if (data.users[index].id === selectedUserId) {
                    selectedUserPlace = counterPlace;
                    users[5] = {
                        place: counterPlace,
                        isSelected: true,
                        data: data.users[index]
                    };
                    break;
                }
            }
        }

        const renderUserBlock = (user, nestedUser) => {
            const place = user.place;
            const isSelected = user.isSelected;
            const {id, name, valueText} = user.data;
            let userBlock;
            let status;

            const checkNested = () => {
                if ((nestedUser) && (orientation === 'vertical')) {
                    return renderUserBlock(nestedUser);
                } else {
                    return '';
                }
            }

            if ((isSelected) && (place !== 1)) {
                status = 'selected';
            }

            if (place === 1) {
                status = 'first';
                userBlock = `
                    <section class="container-rank main">
                            <section class="personal-info">
                                <p class="emoji">${setEmoji(status)}</p>
                                <img src=${setIMG(id)} alt="avatar" class="avatar">
                                <p class="body-text name">${name}</p>
                                <p class="caption light">${valueText}</p>
                            </section>
                            <div class="column high">
                                <h1 class="headline">${place}</h1>
                                ${checkNested()}
                            </div>
                    </section>   
                `;
            }
            if (orientation === 'vertical') {
                if ((isSelected === true) && (place > 3)) {
                    userBlock = `
                        <div class="vote-leader">
                            <section class="personal-info">
                                <p role="img" aria-label="emoji-status" class="emoji">${setEmoji(status)}</p>
                                <img src=${setIMG(id)} alt="avatar" class="avatar">
                                <p class="body-text name">${name}</p>
                                <p class="caption">${valueText}</p>
                                <span></span>
                            </section>
                            <h1 class="headline">${place}</h1>
                        </div>
                    `;
                } else if (place === 3) {
                    userBlock = `
                        <section class="container-rank">
                            <section class="personal-info">
                                <p class="emoji">${setEmoji(status)}</p>
                                <img src=${setIMG(id)} alt="avatar" class="avatar">
                                <p class="body-text name">${name}</p>
                                <p class="caption light">${valueText}</p>
                            </section>
                            <div class="column low">
                                <h1 class="headline">${place}</h1>
                            </div>
                        </section>
                    `;
                } else if (place === 2) {
                    userBlock = `
                        <section class="container-rank">
                            <section class="personal-info">
                                <p class="emoji">${setEmoji(status)}</p>
                                <img src=${setIMG(id)} alt="avatar" class="avatar">
                                <p class="body-text name">${name}</p>
                                <p class="caption light">${valueText}</p>
                            </section>
                            <div class="column medium">
                                <h1 class="headline">${place}</h1>
                            </div>
                        </section>
                    `;
                }
            } else if (orientation === 'horizontal') {
                if ((place === 2) || (place === 3)) {
                    userBlock = `
                        <section class="container-rank">
                            <section class="personal-info">
                                <p class="emoji">${setEmoji(status)}</p>
                                <img src=${setIMG(id)} alt="avatar" class="avatar">
                                <p class="body-text name">${name}</p>
                                <p class="caption light">${valueText}</p>
                            </section>
                            <div class="column medium">
                                <h1 class="headline">${place}</h1>
                            </div>
                        </section>
                    `;
                } else if (((place === 4) || (place === 5)) || (isSelected)) {
                    userBlock = `
                        <section class="container-rank">
                            <section class="personal-info">
                                <p class="emoji">${setEmoji(status)}</p>
                                <img src=${setIMG(id)} alt="avatar" class="avatar">
                                <p class="body-text name">${name}</p>
                                <p class="caption light">${valueText}</p>
                            </section>
                            <div class="column low">
                                <h1 class="headline">${place}</h1>
                            </div>
                        </section>
                    `;
                }
            }
            return userBlock
        }

        const preRender = () => {
            let template = '';
            if (orientation === 'vertical') {
                if (users[5]) {
                    template += renderUserBlock(users[2]);
                    template += renderUserBlock(users[0], users[5]);
                    template += renderUserBlock(users[1]);
                } else if (users[3].isSelected) {
                    template += renderUserBlock(users[2]);
                    template += renderUserBlock(users[0], users[3]);
                    template += renderUserBlock(users[1]);
                } else if (users[4].isSelected) {
                    template += renderUserBlock(users[2]);
                    template += renderUserBlock(users[0], users[4]);
                    template += renderUserBlock(users[1]);
                } else {
                    template += renderUserBlock(users[2]);
                    template += renderUserBlock(users[0]);
                    template += renderUserBlock(users[1]);
                }
            } else {
                if (users[5]) {
                    template += renderUserBlock(users[5]);
                    template += renderUserBlock(users[2]);
                    template += renderUserBlock(users[0]);
                    template += renderUserBlock(users[1]);
                    template += renderUserBlock(users[3]);
                } else {
                    template += renderUserBlock(users[4]);
                    template += renderUserBlock(users[2]);
                    template += renderUserBlock(users[0]);
                    template += renderUserBlock(users[1]);
                    template += renderUserBlock(users[3]);
                }
            }

            return template;
        }

        const insertHTML = () => {
            layout += `
                <div class="container">
                    <div class="container-headline">
                        <h1 class="headline">${data.title}</h1>
                        <p class="body-text light">${data.subtitle}</p>
                    </div>
                    <div class="container-inner">
                    ${preRender()}
                    </div>
                </div>
            `;
        }
        setUsers();
        getEmoji();
        insertHTML();
    }
    if (alias === 'vote') {
        let users = [];

        const setUsers = () => {
            data.users.forEach(element => {

                if (selectedUserId === element.id) {
                    users.push({
                        isSelected: true,
                        data: element
                    })
                } else {
                    users.push({
                        isSelected: false,
                        data: element
                    })
                }
            })
        }

        const setEmoji = (id) => {
            if (selectedUserId === id) {
                return `👍`
            } else return ''
        }

        const renderUser = (user) => {
            let template = '';
            if (user) {
                if (user.isSelected) {
                    template += `
                        <section class="personal-info vote selected">
                            <p class="emoji">${setEmoji(user.data.id)}</p>
                            <img src=${setIMG(user.data.id)} alt="avatar" class="avatar">
                            <p class="body-text name">${user.data.name}</p>
                        </section>
                    `
                } else {
                    template += `
                        <section class="personal-info vote">
                            <img src=${setIMG(user.data.id)} alt="avatar" class="avatar">
                            <p class="body-text name">${user.data.name}</p>
                        </section>
                    `
                }
            } else {
                return `
                    <section class="personal-info-filler">
                    </section>
                `;
            }

            return template
        }

        const renderRow = (type, user1, user2, user3) => {
            let template = '';

            if (orientation === 'vertical') {
                if (type === 'side') {
                    template += `
                        <div class="row">
                        ${renderUser(user1)}
                        ${renderUser(user2)}
                        ${renderUser(user3)}
                        </div>
                    `
                } else if (type === 'main') {
                    template += `
                        <div class="row">
                        <button class="vote-button high"></button>
                        ${renderUser(user1)}
                        ${renderUser(user2)}
                        <button class="vote-button"></button>
                        </div>
                    `
                }
            } else if (orientation === 'horizontal') {

                if (type === 'side') {
                    template += `
                        <div class="row">
                        ${renderUser(user1)}
                        ${renderUser(user2)}
                        </div>
                    `
                } else if (type === 'side-single') {
                    template += `
                        <div class="row">
                        ${renderUser(user1)}
                        </div>
                    `
                } else if (type === 'main') {
                    template += `
                        <div class="row">
                        <button class="vote-button high"></button>
                        <button class="vote-button"></button>
                        </div>
                    `
                }

            }
            return template
        }

        const preRender = () => {
            let template = '';
            let slideCounter = 0;
            let userCounter = users.length;
            let offsetUser = 0;

            if (data.offset) {
                offsetUser = data.offset - 1;
            }

            if (orientation === 'vertical') {
                while (userCounter > 0) {
                    let firstUserCounter = (slideCounter * 8) + offsetUser;

                    template += '<div class="slide">';
                    template += renderRow(
                        'side',
                        users[firstUserCounter],
                        users[firstUserCounter+3],
                        users[firstUserCounter+6]
                    );
                    template += renderRow(
                        'main',
                        users[firstUserCounter+1],
                        users[firstUserCounter+4]
                    );
                    template += renderRow(
                        'side',
                        users[firstUserCounter+2],
                        users[firstUserCounter+5],
                        users[firstUserCounter+7]
                    );
                    template += '</div>'


                    slideCounter++;
                    userCounter -= offsetUser;
                    userCounter -= 8;
                }

            } else if (orientation === 'horizontal') {
                while (userCounter > 0) {
                    let firstUserCounter = (slideCounter * 6) + offsetUser;

                    template += '<div class="slide">';
                    template += renderRow(
                        'side-single',
                        users[firstUserCounter]
                    );
                    template += renderRow(
                        'side',
                        users[firstUserCounter+1],
                        users[firstUserCounter+4]
                    );
                    template += renderRow(
                        'main'
                    );
                    template += renderRow(
                        'side',
                        users[firstUserCounter+2],
                        users[firstUserCounter+5]
                    );
                    template += renderRow(
                        'side-single',
                        users[firstUserCounter+3]
                    );
                    template += '</div>'


                    slideCounter++;
                    userCounter -= offsetUser;
                    userCounter -= 6;
                }
            }

            return template;
        }

        const insertHTML = () => {
            document.body.classList.add('vote');
            layout += `
                <div class="container vote">
                    <div class="container-headline vote">
                        <h1 class="headline">${data.title}</h1>
                        <p class="body-text light">${data.subtitle}</p>
                    </div>
                    <div class="container-inner vote">
                        ${preRender()}
                    </div>
            </div>`;
        }
        setUsers();
        insertHTML();
    }
    if (alias === 'chart') {
        let leaders = [];
        let values = [];
        let valueTitles = [];
        let maxValue = 0;

        const  setLeaders = () => {
            for (let i = 0; i < 2; i++) {
                leaders.push(data.users[i]);
            }
        }

        const renderLeaders = () => {
            let template = '';

            template += `
                <section class="chart-leader">
                    <img src=${setIMG(leaders[0].id)} alt="avatar" class="avatar">
                    <div class="text-info">
                        <p class="body-text name">${leaders[0].name}</p>
                        <p class="caption light">${leaders[0].valueText}</p>
                    </div>
                </section>
                <span></span>
                <section class="chart-leader">
                    <img src=${setIMG(leaders[1].id)} alt="avatar" class="avatar">
                    <div class="text-info">
                        <p class="body-text name">${leaders[1].name}</p>
                        <p class="caption light">${leaders[1].valueText}</p>
                    </div>
                </section>
            `;

            return template
        }

        const setChartInfo = () => {
            data.values.forEach(element => {
                if (element.active) {
                    values.push({
                        isActive: true,
                        value: element.value
                    })
                } else {
                    values.push({
                        isActive: false,
                        value: element.value
                    })
                }

                valueTitles.push(element.title)
            })
        }

        const checkIfActive = (element) => {
            if (element.isActive) {
                return 'active'
            } else return ''
        }

        const setMaxValue = () => {
            values.forEach(element => {
                if (element.value > maxValue) {
                    maxValue = element.value
                }
            })
        }

        const setElementHeight = (value) => {
            const ratio = value/maxValue;

            if (orientation === 'vertical') {
                return ((ratio * 70) + '%')
            } else {
                return ((ratio * 78.524) + '%')
            }
        }

        const setHeading = (value) => {
            if (value !== 0) {
                return value
            } else return  ''
        }

        const renderChart = () => {
            let template = '';

            values.forEach(element => {
                template += `
                    <section class="chart-column-wrapper">
                        <h1 class="subhead">${setHeading(element.value)}</h1>
                        <span class="chart-column ${checkIfActive(element)}"
                            style="height: ${setElementHeight(element.value)}"
                        ></span>
                    </section>
                `
            })

            return template
        }



        const renderChartTitles = () => {
            let template = '';

            valueTitles.forEach(element => {
                template += `
                    <p class="chart-info-text body-text">${element}</p>
                `
            })

            return template
        }

        const insertHTML = () => {
            layout += `
                <div class="container chart">
                    <div class="container-headline">
                        <h1 class="headline">${data.title}</h1>
                        <p class="body-text light">${data.subtitle}</p>
                    </div>
                    <div class="chart-wrapper">
                        <div class="chart-container">
                            ${renderChart()}
                        </div>
                        <div class="chart-info">
                           ${renderChartTitles()}
                        </div>
                    </div>
                    <div class="container-inner chart">
                        <div class="leaders-block">
                            ${renderLeaders()}
                        </div>
                    </div>
                </div>
            `;
        }

        setLeaders();
        setChartInfo();
        setMaxValue();
        insertHTML();
    }
    if (alias === 'diagram') {
        const setInfoClass = (type) => {
            if (type === 'h1') {
                if (orientation === 'vertical') {
                    return('headline')
                } else {
                    return('subhead')
                }
            } else {
                if (orientation === 'vertical') {
                    return('subhead light')
                } else {
                    return('body-text light')
                }
            }
        }

        const determineGrade = (index) => {
            if (index === 0) {
                return 'extra'
            } else if (index === 1) {
                return 'max'
            } else if (index === 2) {
                return 'mid'
            } else {
                return 'min'
            }
        }


        const preRender =  () => {
            let template = '';
            const categories = data.categories;
            for(let i = 0; i < categories.length; i++) {
                const {title, valueText, differenceText} = categories[i];

                let value = valueText.split(' ');
                let difference = differenceText.split(' ');

                template +=`
                    <section class="diagram-info-block">
                        <span class="color-info ${determineGrade(i)}"></span>
                        <p class="info-text body-text">${title}</p>
                        <p class="info-change body-text light">${value[0]}</p>
                        <p class="info-state body-text light">${difference[0]}</p>
                    </section>
                `

                if (i !== (categories.length - 1)) {
                    template += '<hr>';
                }
            }
            return template
        }


        const insertHTML = () => {
            document.body.classList.add('diagram');
            layout += `
                <div class="container diagram">
                    <div class="container-headline">
                        <h1 class="headline">${data.title}</h1>
                        <p class="body-text light">${data.subtitle}</p>
                    </div>
                    <div class="container-inner-diagram">
                        <div class="container-doughnut">
                            <div class="doughnut-wrap">
                                <canvas id="doughnut-chart" width="328" height="328"></canvas>
                            </div>
                            <div class="doughnut-info">
                                <h1 class="${setInfoClass('h1')}">${data.totalText}</h1>
                                <h2 class="${setInfoClass('h2')}">${data.differenceText}</h2>
                            </div>
                        </div>
                        <div class="container-info-diagram">
                            ${preRender()}
                        </div>
                    </div>
                </div>
            `;
        }

        insertHTML();
    }
    if (alias === 'activity') {
        if (theme === 'light') {
            importAll(require.context('./img/elements/heatmap/light/blocks/', false, /\.svg$/), heatmapBlocks);
        } else {
            importAll(require.context('./img/elements/heatmap/dark/blocks/', false, /\.svg$/), heatmapBlocks);
        }

        let heatmapData = [];

        const prepareData = () => {
            const rawData = data.data;
            if (orientation === 'vertical') {
                for (let i = 0; i < 24; i++) {
                    let temp = [];
                    for (const element in rawData) {
                        temp.push(rawData[element][i]);
                    }
                    heatmapData.push(temp);
                }
            } else if (orientation === 'horizontal') {
                for (const element in rawData) {
                    let sum = 0;
                    let temp = [];
                    for (let i = 0; i < 24; i++) {
                        sum += rawData[element][i];
                        if (i % 2 !== 0) {
                            temp.push(sum);
                            sum = 0;
                        }
                    }
                    heatmapData.push(temp);
                }
            }
        }

        const renderRows = () => {
            let template = '';
            if (orientation === 'vertical') {
                for (let i = 0; i < 24; i++) {
                    template += '<div class="heatmap-row">';
                    for (let k = 0; k < 7; k++) {
                        if (heatmapData[i][k] === 0) {
                            template += `<img src=${heatmapBlocks[3]} class="heatmap-block min">`
                        } else if (heatmapData[i][k] < 3) {
                            template += `<img src=${heatmapBlocks[2]} class="heatmap-block mid">`
                        } else if (heatmapData[i][k] < 5) {
                            template += `<img src=${heatmapBlocks[1]} class="heatmap-block max">`
                        } else {
                            template += `<img src=${heatmapBlocks[0]} class="heatmap-block extra">`
                        }
                    }
                    template += '</div>'
                }
            } else {
                for (let i = 0; i < 7; i++) {
                    template += '<div class="heatmap-row">';
                    for (let k = 0; k < 12; k++) {
                        if (heatmapData[i][k] === 0) {
                            template += `<img src=${heatmapBlocks[3]} class="heatmap-block min">`
                        } else if (heatmapData[i][k] < 3) {
                            template += `<img src=${heatmapBlocks[2]} class="heatmap-block mid">`
                        } else if (heatmapData[i][k] < 5) {
                            template += `<img src=${heatmapBlocks[1]} class="heatmap-block max">`
                        } else {
                            template += `<img src=${heatmapBlocks[0]} class="heatmap-block extra">`
                        }
                    }
                    template += '</div>';
                }
            }
            return template
        }

        const renderHTML = () => {
            document.body.classList.add('heatmap');
            layout += `
            <div class="container-headline">
                    <h1 class="headline">${data.title}</h1>
                    <p class="body-text light">${data.subtitle}</p>
            </div>
            <div class="container heatmap">
                <div class="heatmap-wrapper">
                    ${renderRows()}
                </div>
                <div class="heatmap-info">
                    <section class="heatmap-info-block">
                        <div class="heatmap-info-icon measure"></div>
                        <p class="heatmap-info-text body-text light">1 час</p>
                    </section>
                    <section class="heatmap-info-block">
                        <div class="heatmap-info-icon block0"></div>
                        <p class="heatmap-info-text body-text light">0</p>
                    </section>
                    <section class="heatmap-info-block">
                        <div class="heatmap-info-icon block1"></div>
                        <p class="heatmap-info-text body-text light">1 - 2</p>
                    </section>
                    <section class="heatmap-info-block">
                        <div class="heatmap-info-icon block2"></div>
                        <p class="heatmap-info-text body-text light">3 - 4</p>
                    </section>
                    <section class="heatmap-info-block">
                        <div class="heatmap-info-icon block3"></div>
                        <p class="heatmap-info-text body-text light">5 - 6</p>
                    </section>
                </div>
            </div>
            `;
        }
        prepareData();
        renderHTML();
    }

    if (theme === 'light') {
        import('./themes/light.css')
    } else  {
        import('./themes/dark.css')
    }
    import('./style.sass')

    // window.addEventListener('click', (event) => {
    //     // if (event.target.closest('.vote-button')) {
    //     //     let button = event.target.closest('.vote-button');
    //     //
    //     //     const slides = document.querySelectorAll('.slide');
    //     //     if (button.classList.contains('high')) {
    //     //         if (slideCounter > 0) {
    //     //             slideCounter--;
    //     //             slides.forEach((element, index) => {
    //     //                 if (index === slideCounter) {
    //     //                     element.style.visibility = 'visible';
    //     //                     element.style.display = 'flex';
    //     //                 } else {
    //     //                     element.style.visibility = 'hidden';
    //     //                     element.style.display = 'none';
    //     //                 }
    //     //             })
    //     //         }
    //     //     } else {
    //             if (slideCounter < (slideAmount - 1)) {
    //                 slideCounter++;
    //                 slides.forEach((element, index) => {
    //                     if (index === slideCounter) {
    //                         element.style.visibility = 'visible';
    //                         element.style.display = 'flex';
    //                     } else {
    //                         element.style.visibility = 'hidden';
    //                         element.style.display = 'none';
    //
    //                     }
    //                 })
    //             // }
    //         // }
    //         // checkButtons(alias);
    //     }
    //
    //     if (event.target.closest('.personal-info') && (alias === 'vote')) {
    //         const target = event.target.closest('.personal-info');
    //         const currentSelected = document.querySelector('.selected');
    //         if (currentSelected) {
    //             currentSelected.classList.remove('selected');
    //             currentSelected.querySelectorAll('.emoji')[0].remove();
    //         };
    //         target.classList.add('selected');
    //         target.insertAdjacentHTML('afterbegin', '<p class="emoji">👍</p>');
    //     }
    // })

    return layout;
}

// function checkButtons(alias) {
//     if (alias === 'vote') {
//         const currentSlide = document.querySelectorAll('.slide')[slideCounter];
//         const buttons = currentSlide.querySelectorAll('.vote-button');
//         if (slideCounter === 0) {
//             buttons[0].disabled = true
//             buttons[1].disabled = (slideAmount === 1);
//         } else if (slideCounter === (slideAmount - 1)) {
//             buttons[0].disabled = false
//             buttons[1].disabled = true
//         }
//     }
// }



getData(templateData)