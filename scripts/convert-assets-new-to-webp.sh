#!/usr/bin/env bash

set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source_dir="${1:-${project_root}/assets/new}"
quality="${WEBP_QUALITY:-85}"

if ! command -v cwebp >/dev/null 2>&1; then
  echo "Erro: cwebp não está instalado." >&2
  exit 1
fi

if [[ ! -d "${source_dir}" ]]; then
  echo "Erro: diretório não encontrado: ${source_dir}" >&2
  exit 1
fi

converted=0

while IFS= read -r -d '' source_file; do
  destination_file="${source_file%.*}.webp"

  echo "Convertendo: ${source_file} -> ${destination_file}"
  cwebp -quiet -mt -m 6 -q "${quality}" "${source_file}" -o "${destination_file}"

  if [[ ! -s "${destination_file}" ]]; then
    echo "Erro: arquivo WebP inválido: ${destination_file}" >&2
    exit 1
  fi

  rm "${source_file}"
  converted=$((converted + 1))
done < <(find "${source_dir}" -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.tif' -o -iname '*.tiff' \) -print0)

echo "Conversão concluída: ${converted} arquivo(s) convertido(s) para WebP."
