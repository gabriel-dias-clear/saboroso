class ConsoleColors {
    static red(text) {
      return `\x1b[31m${text}\x1b[0m`; // Vermelho
    }
  
    static green(text) {
      return `\x1b[32m${text}\x1b[0m`; // Verde
    }
  
    static yellow(text) {
      return `\x1b[33m${text}\x1b[0m`; // Amarelo
    }
  
    static blue(text) {
      return `\x1b[34m${text}\x1b[0m`; // Azul
    }
  
    static magenta(text) {
      return `\x1b[35m${text}\x1b[0m`; // Magenta
    }
  
    static cyan(text) {
      return `\x1b[36m${text}\x1b[0m`; // Ciano
    }
  
    static white(text) {
      return `\x1b[37m${text}\x1b[0m`; // Branco
    }
  }
  
  
module.exports = ConsoleColors;    