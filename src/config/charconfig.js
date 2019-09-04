export default {
  regChar: new RegExp(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇ \s]+$/),
  regSpace: new RegExp(/^\s+|\s+$/g),
  regSpac: new RegExp(/[^\s+|][\s+$]/g),
};
