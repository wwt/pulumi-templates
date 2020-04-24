#!/bin/bash
##
## This script changes tags for all the CP images to RedHat ubi8 image.
##
set -o pipefail
set +o xtrace

# supported
supported_suffix_tag=(ubi8)

usage() {
  echo "usage: $0 add or remove suffix for all the CP images on the Helm charts"
  echo "  -i | --add-suffix : add image tag suffix, supported: ${supported_suffix_tag[*]}"
  echo "  -r | --remove-suffix : remove image tag suffix, supported: ${supported_suffix_tag[*]}"
  echo "  -h | --help : Usage command"
  exit
}

update_charts() {

  suffix=$1
  type=$2

  validate_suffix "${suffix}"
  ##
  ## Update images tags for each CP charts.
  ##
  # shellcheck disable=SC2162
  while IFS=":" read line val; do
    chart_name=${line}
    tag_name=$(echo "${val}" | tr -d ' ')
    if [[ ${chart_name} == "externaldns" ]]; then
      continue
    fi

    if [[ "${type}" == "add" ]]; then
       update_remove_suffix "${chart_name}" "${tag_name}" "${tag_name}-${suffix}"

    elif [[ $type == "remove" ]]; then
       update_remove_suffix "${chart_name}" "${tag_name}-${suffix}" "${tag_name}"
    fi
  done <"${DIR}/../IMAGES"

  echo "==> All CP helm charts are updated"
}

update_remove_suffix() {

  local chart_name=$1
  local source_tag=$2
  local dest_tag=$3

   if [[ ${chart_name} == "init-container" ]]; then
      sed -i.bak s/"${source_tag}"$/"${dest_tag}"/g "${helm_path}values.yaml"
      rm "${helm_path}/values.yaml.bak"
   else
      sed -i.bak s/"${source_tag}"$/"${dest_tag}"/g "${helm_path}charts/${chart_name}/values.yaml"
      rm "${helm_path}charts/${chart_name}/values.yaml.bak"
   fi
    echo "==> ${chart_name} image tag changed from ${source_tag} -> ${dest_tag} "
}

validate_suffix() {
  suffix=$1
  if [[ ! "${supported_suffix_tag[*]} " == *"${suffix}"* ]]; then
    echo "==> Image tag suffix ${suffix} is not supported yet. The supported suffix : ${supported_suffix_tag[*]}"
    exit
  fi
}

parse_args() {
    args=()
    while [[ "$1" != "" ]]; do
        case "$1" in
            -i | --add )    add_suffix="${2}"; shift;;
            -r | --remove ) remove_suffix="${2}"; shift;;
            -h | --help )   help="true"; shift;;
            * )             args+=("$1")
        esac
        shift
    done

  set -- "${args[@]}"
  if [[ ! -z ${help} ]]; then
      usage
  fi
  if [[ ! -z ${add_suffix} ]]; then
    echo "==> Update all helm chart's image tag with suffix $add_suffix "
    update_charts "${add_suffix}" "add"
    exit
  elif [[ ! -z ${remove_suffix} ]]; then
    echo "==> Remove suffix  $remove_suffix from all helm charts"
    update_charts "${remove_suffix}" "remove"
    exit
  fi

  usage
}

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
helm_path=$(printf "%s/../helm/confluent-operator/" "${DIR}")
parse_args "$@"
