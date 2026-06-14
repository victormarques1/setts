# Regras de Negócio

## Workout

Um treino pertence a apenas um usuário.

Exemplos:

- Treino A
- Treino B
- Treino Superior

---

## Exercise

Um exercício pertence a um treino.

Exemplos:

- Supino Reto
- Agachamento

---

## Workout Session

Representa uma execução de um treino.

Cada execução gera um histórico permanente.

---

## Set Record

Representa uma série executada.

Campos:

- peso
- repetições
- número da série

---

## Histórico

Registros antigos não devem ser alterados.

O histórico é considerado imutável.

---

## Progressão

A progressão será calculada utilizando os registros históricos das séries.
