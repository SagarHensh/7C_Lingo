//for invoice recievable functionality


// get invoice Ids array 
export function getInvoiceIdFromArray(objData, arrIds) {
    if (objData) {
        if(objData.isSelected == true){
          arrIds.push(objData.invoiceId);
        } else {
          for (let i = 0; i < arrIds.length; i++) {
              if (arrIds[i] == objData.invoiceId) {
                arrIds.splice(i, 1);
              }
            }
        }
    }
    return arrIds;
  }
  