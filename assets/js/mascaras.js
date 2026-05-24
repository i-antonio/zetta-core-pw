function mascaraNumeros(event) {
  event.target.value = event.target.value.replace(/[^0-9]/g, '');
}

function mascaraCEP(event) {
  let value = event.target.value.replace(/[^0-9]/g, '');
  
  if (value.length > 5) {
    value = value.slice(0, 5) + '-' + value.slice(5, 8);
  }
  
  event.target.value = value;
}

function mascaraDiaMes(event) {
  let value = event.target.value.replace(/[^0-9]/g, '');
  
  if (value.length > 2) {
    value = value.slice(0, 2) + '/' + value.slice(2, 4);
  }
  
  event.target.value = value;
}

window.mascaras = {
  numeros: mascaraNumeros,
  cep: mascaraCEP,
  diaMes: mascaraDiaMes
}