# 📦 Como versionar e publicar os outfits no GitHub

O servidor baixa os sprites de outfit a partir de uma release do GitHub.
Isso é controlado por essas variáveis no Dockerfile:

```dockerfile
# pasta destino dentro do container, relativa ao WORKDIR
ARG OUTFIT_FOLDER=generated/outfits
ENV OUTFIT_FOLDER=${OUTFIT_FOLDER}

# repositório GitHub onde estão os outfits
ENV GITHUB_OWNER=mitgdev
ENV GITHUB_REPO=mitg.forge

# tag da release de outfits
ARG GITHUB_OUTFITS_RELEASE_TAG=miforge-outfits-15.11
ENV GITHUB_OUTFITS_RELEASE_TAG=${GITHUB_OUTFITS_RELEASE_TAG}

# nome do arquivo zip dentro da release
ARG GITHUB_OUTFITS_FILE=outfits.zip
ENV GITHUB_OUTFITS_FILE=${GITHUB_OUTFITS_FILE}
```

E o download é feito desta URL:

```dockerfile
ARG OUTFIT_ARCHIVE_URL="https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases/download/${GITHUB_OUTFITS_RELEASE_TAG}/${GITHUB_OUTFITS_FILE}"
```

Ou seja:

Repo: <https://github.com/mitgdev/mitg.forge>

Tag da release: miforge-outfits-15.11

Asset na release: outfits.zip (nome é importante!)

## 📁 Estrutura esperada dentro do outfits.zip

Quando o zip é extraído, o Dockerfile procura uma pasta chamada outfits_anim:

```dockerfile
 ARG OUTFIT_INNER_NAME=outfits_anim
ENV OUTFIT_INNER_NAME=${OUTFIT_INNER_NAME}
# ...
find /tmp/outfits -type d -name "${OUTFIT_INNER_NAME}" | head -n 1
```

Portanto, o outfits.zip deve conter em algum lugar uma pasta com esse nome, por exemplo:

```bash
latest_walk/
  outfits_anim/
    1/
      1_0_0_0.png
      1_0_0_1.png
      1_0_0_2.png
      ...
    2/
      2_1_1_1.png
      2_1_1_2.png
      ...
    ...
```

A estrutura exata acima de outfits_anim (latest_walk/, etc.) não importa,
desde que exista uma pasta outfits_anim com os PNGs dentro.

## 🚀 Como criar uma release de outfits corretamente

1. Gere o pacote dos outfits localmente:

- Estrutura interna precisa ter uma pasta outfits_anim.
- Compacte tudo em um zip:
  - Exemplo: outfits-15.11.zip (nome local, não importa).

2. Vá até o repositório no GitHub:
  <https://github.com/mitgdev/mitg.forge>

3. Abra a aba “Releases” → “Draft a new release”.

4. Preencha:

- Tag: use o padrão

  miforge-outfits-<versão-do-cliente>

  Ex.: miforge-outfits-15.11

- Release title: algo como

  @miforge/outfits@15.11

- (Opcional) marque como Latest.

5. Em Assets, arraste o seu zip, mas renomeie para exatamente:

```bash
outfits.zip
```

6. Clique em “Publish release”.

Pronto. A partir daí, builds usando:

```dockerfile
ARG GITHUB_OUTFITS_RELEASE_TAG=miforge-outfits-15.11
```

baixarão os outfits dessa release automaticamente.

## 🔁 Atualizando para uma nova versão de cliente

Quando a CipSoft lançar uma versão nova (ex.: 15.12):

1. Gere um novo zip com os sprites atualizados (outfits-15.12.zip).
2. Crie uma nova release seguindo o mesmo padrão:

- Tag: miforge-outfits-15.12
- Asset renomeado para: outfits.zip

3. Na hora de buildar a imagem, você pode:

- Alterar o default no Dockerfile:

  ```dockerfile
  ARG GITHUB_OUTFITS_RELEASE_TAG=miforge-outfits-15.12
  ```

- ou sobrescrever via `--build-arg`:

  ```bash
  docker build --build-arg GITHUB_OUTFITS_RELEASE_TAG=miforge-outfits-15.12 ...
  ```

Assim, cada versão da imagem fica claramente ligada à versão de outfits/cliente que ela usa.
