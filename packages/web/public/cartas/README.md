# Assets das cartas

Estrutura de imagens servidas estaticamente pelo Vite a partir de `public/`.
Tudo aqui é acessível em runtime pelo caminho `/cartas/...` (sem `public/`).

> Estrutura preparada — os assets reais ainda **não** foram criados.
> Enquanto um arquivo não existir, o componente usa o placeholder/fallback
> (gradiente verde para foto, emoji para ícone).

## Diretórios

| Pasta         | Conteúdo                                      |
|---------------|-----------------------------------------------|
| `fotos/`      | Foto da strain de cada carta genética         |
| `icones/`     | Ícones dos 7 atributos                         |
| `especiais/`  | Arte das cartas VANTAGEM e REVÉS (se houver)   |
| `bg/`         | Background/pattern das cartas (tileable)       |

## fotos/ — fotos das strains

- **Formato:** WebP (primário), JPG (fallback)
- **Dimensão:** 400×560px (proporção 5:7, igual à carta)
- **Nomenclatura:** `<ID>.webp` — o ID precisa bater com o `id` da carta no baralho
  (`packages/engine/src/cartas/baralho.ts`)

IDs das 28 genéticas:

```
A1  A2  A3  A4  A5  A6  A7  A8  A9  A10  A11  A12
B1  B2  B3
C1  C2  C3
D1
E1  E2  E3  E4  E5  E6  E7
F1  F2
```

Exemplos: `A1.webp`, `A1.jpg`, `A10.webp`, `F2.webp`.

## icones/ — ícones dos atributos

- **Formato:** SVG (vetorial, escalável)
- **Dimensão:** 32×32px (viewBox)
- **Nomenclatura** (um por atributo):

```
thc.svg
cbd.svg
relaxamento.svg
foco.svg
felicidade.svg
fome.svg
sono.svg
```

## especiais/ — cartas especiais (opcional)

- **Formato:** WebP ou SVG
- Arte para `VANTAGEM` e `REVÉS`, caso se queira substituir os emojis (⭐ / 💀).

## bg/ — background/pattern (opcional)

- **Formato:** WebP ou SVG
- Padrão tileable para o fundo/verso das cartas.
