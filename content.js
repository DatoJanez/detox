let model_
const getModel = async () => new Promise(r => {
    if(model_) {
        r(model_)
        return
    }
    toxicity.load(0.5).then(m => {
        model_ = m
        r(model_)
    }) 
})
getModel().then(model_ => model = model_)

const drow = (prediction) => {
    let cont =  document.querySelector('div[role="scrollbar-lenses"]')
    let target = document.querySelector('div[data-name-j="'+prediction.label+'"]')
    // let prog = document.querySelector('div[data-name-j="'+prediction.label+'"] > div')
    let prog = document.querySelector('div[data-name-j="'+prediction.label+'"] > div.bar-j')
    let score = document.querySelector('div[data-name-j="'+prediction.label+'"] > div.score-1-j')
    
    let calc_dom = document.querySelector('div[data-name-j="calculating"]')
    if (calc_dom) calc_dom.parentNode.removeChild(calc_dom)
    
    if(!target) {
        let div = document.createElement('div')
        div.setAttribute("data-name-j", prediction.label)
        div.setAttribute("style", 'text-transform: capitalize;')
        // div.className = cont.children[0].className
        div.classList.add('lable-j')
        div.innerHTML = prediction.label.replace('_', ' ')
        // + '<small class="f1vn8v6g _40dc33a5-navigation-outcomeStatus">&nbsp;</small>'
        // prog = cont.children[0].querySelector('div').cloneNode('true')
        // div.appendChild(prog)
        
        prog = document.createElement('div')
        prog.classList.add('bar-j')
        div.appendChild(prog)

        score = document.createElement('div')
        score.classList.add('score-1-j')
        div.appendChild(score)

        cont.appendChild(div)
    }
    
    let val  = Math.round( 100 * prediction.results[0].probabilities[1])
    // prog.querySelector('div').setAttribute('style', 'transform: translateX('+ val +'%); color: #ea1537;')// opacity:.' + val + '')
    // prog.className = 'pie-j'
    // console.log(val, Math.ceil(val/25), prediction.results[0].probabilities[1], 3.6 * (val > 50 ? val - 50 : val))
    // prog.classList.add('pie-j-q' + Math.ceil(val/25))
    // prog.classList.add('pie-j-' + Math.round(3.6 * (val > 50 ? val - 50 : val)))
    score.innerHTML = Math.round(val)
    // score.classList.add('pie-j-q' + Math.ceil(val/25))
    prog.innerHTML = '<div class="pie-j-q' + Math.ceil(val/25) + '" style="margin-left:-' + (100 - val)+ '%" ></div>'
}

class PredictClass{

    constructor(text){
        if(!text || !text.length || text.length < 30) {
            document.querySelector('div[role="scrollbar-lenses"]').innerHTML = ''
            return
        }
        [...document.querySelectorAll('div[role="scrollbar-lenses"] > div[data-name-j]')].forEach(div => div.parentNode.removeChild(div))
        this.text = text

        let cont =  document.querySelector('div[role="scrollbar-lenses"]')
        let div = document.createElement('div')
        div.setAttribute("data-name-j", 'calculating')
        div.setAttribute("style", 'text-transform: capitalize;')
        // div.className = cont.children[0].className
        div.classList.add('lable-j')
        div.classList.add('lable-j-2')
        div.innerHTML = '<div>Measuring the toxicity...</div>'+ '<br/><div class="loader">Loading...</div>'
        // prog = cont.children[0].querySelector('div').cloneNode('true')
        // div.appendChild(prog)

        cont.appendChild(div)

        document.querySelector('div[role="scrollbar-lenses"]')

        getModel()
            .then(model => model
                .classify([text])
                .then(predictions => {
                    if(this.text != document.getElementsByTagName('textarea')[0].value) return
                    predictions.forEach(drow)
                
                }))
    }
}
const debounced = (delay, fn)=> {
    let timerId;
    return (...args) => {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        fn(...args);
        timerId = null;
      }, delay);
    }
  }

const myHandler = e => new PredictClass(e.target.value).then(console.log)
const dHandler = debounced(2000, myHandler);
document.getElementsByTagName('textarea')[0].addEventListener("input", dHandler);
