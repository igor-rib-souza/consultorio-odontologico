class Consulta {
    #cpf;
    #data;
    #horaInicial;
    #horaFinal;
  
    constructor(cpf, data, horaInicial, horaFinal) {
      this.#cpf = cpf;
      this.#data = data;
      this.#horaFinal = horaFinal;
      this.#horaInicial = horaInicial;
    }
  
    get cpf() {
      return this.#cpf;
    }
  
    get data() {
      return this.#data;
    }
  
    get horaInicial() {
      return this.#horaInicial;
    }
  
    get horaFinal() {
      return this.#horaFinal;
    }
  }
  
  export default Consulta;
  