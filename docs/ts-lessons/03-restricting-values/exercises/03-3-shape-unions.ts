// The main focus of this chapter is to understand that if try define say type Something = oneTYpe | otherTypeShape and then while using you can not mix those , you need to use consistentatly either one

type Result = string | { raw: string; sanitized: string }

// let result: Result = 'pass'  could be this OR
let result: Result = { raw: 'inaam', sanitized: 'yes' }

type Options = string | { label: string; value: string }

let options: Options = 'firstoption'

options = { label: 'FirstOption', value: 'firstoption' }

// let newoption: Options = {label: 'newlable'} it will squiggle , why ?

// newoption = {'inaam'}  it will also squiggle why ?
