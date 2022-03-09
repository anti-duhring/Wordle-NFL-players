const buttonLegend = document.querySelector('.legend-button')
const legend = document.querySelectorAll('.legend-toggle')
const backgroundLegend = document.querySelector('.legend-bg')

buttonLegend.addEventListener('click', toggleInformations)
backgroundLegend.addEventListener('click', toggleInformations)

function toggleInformations(){
    legend.forEach((element, index, array) => {
        element.classList.toggle('hide-legend')
    })
}