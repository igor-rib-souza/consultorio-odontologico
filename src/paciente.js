class Paciente {
    #cpf;
    #nome;
    #dataNascimento;
    #consultas;

  
    constructor(cpf, nome, dataNascimento) {
      this.#cpf = cpf;
      this.#nome = nome;
      this.#dataNascimento = dataNascimento;
      this.#consultas = [];
    }
  
    get cpf() {
      return this.#cpf;
    }
  
    get nome() {
      return this.#nome;
    }
  
    get dataNascimento() {
      return this.#dataNascimento;
    }

    get consultas() {
        return this.#consultas;
      }
  }
  
export default Paciente;