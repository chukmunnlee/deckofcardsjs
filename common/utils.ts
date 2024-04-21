export const toBoolean = (full: string) => {
    let _full = false
    if (full != undefined)
      _full = full.trim().toLowerCase() === 'true' || (full === '') 
    return _full
  }

export const toString = (str: string, defValue = '') => !str? defValue: str

