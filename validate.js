const VALIDATION_MSG = {
    is_string: {
        passed: 'String validation successful',
        failed: 'The value provided is not a valid string'
    },
    is_not_string: {
        passed: 'Not string validation successful',
        failed: 'The value provided failed validation test'
    },
    is_not_null: {
        passed: 'Not null validation successful',
        failed: 'The value provided failed validation test'
    },
    is_null: {
        passed: 'Null validation successful',
        failed: 'The value provided failed validation test'
    },
    is_array: {
        passed: 'Array validation successful',
        failed: 'The value provided is not a valid array'
    },
    is_integer: {
        passed: 'Integer validation successful',
        failed: 'Yhe value provided is not a valid integer'
    }
}

const mergeValidationMessage = (validationMsg = {}) => {
    if (Object.keys(validationMsg).length === 0) return

    let finalValidationMsg = VALIDATION_MSG
    Object.keys(finalValidationMsg).forEach(rule => {
        if (validationMsg[rule]) {
            typeof validationMsg[rule] === 'string'
                ? finalValidationMsg[rule].failed = validationMsg[rule]
                : finalValidationMsg[rule] = {...finalValidationMsg[rule], ...validationMsg[rule]}
        }
    })
    return finalValidationMsg
}

const standardValidationResponse = (rule, validStatus, passedResponseMessage = '', failedResponseMessage = '') => {
    let validationResponse = {}
    validationResponse[rule] = {
        isValidated: validStatus,
        message: validStatus ? passedResponseMessage : failedResponseMessage
    }
    return validationResponse
}

export const validate = (target, rules = '', matchers = [], customValidationMessage = {}) => {
    // Validation Rules

    // is_string|is_not_string|is_not_null|is_null|is_integer|is_not_integer|is_bool|is_not_bool
    // |is_array|is_not_array|is_object|is_not_object|is_empty|is_not_empty|can_be_string
    // |can_be_null|can_be_integer|can_be_bool|can_be_array|can_be_array|can_be_array|can_be_empty


    let validationMessage = VALIDATION_MSG 

    // If user provided a custom validation message then merge with default validation rules
    Object.keys(customValidationMessage).length !== 0 && (validationMessage = mergeValidationMessage(customValidationMessage))

    let hasPassedValidation = true
    let validationResponse = {}
    let validationRuleList = rules.split('|')
    
    validationRuleList.forEach(rule => {
        if (rule === 'is_string') {
            let isValid = typeof target === 'string'
            hasPassedValidation = hasPassedValidation && isValid
            validationResponse = { 
                ...validationResponse,
                ...standardValidationResponse(rule, isValid, validationMessage[rule]?.passed || 'Validation Passed', validationMessage[rule]?.failed || 'Validation Failed'),
        
            }
        }

        if (rule === 'is_not_string') {
            let isValid = typeof target !== 'string'
            hasPassedValidation = hasPassedValidation && isValid
            validationResponse = { 
                ...validationResponse,
                ...standardValidationResponse(rule, isValid, validationMessage[rule]?.passed || 'Validation Passed', validationMessage[rule]?.failed || 'Validation Failed'),
        
            }
        }

        if (rule === 'is_not_null') {
            let isValid = target ? true : target === '' ? true : typeof target === 'undefined' ? true : target === 0 ? true : false
            hasPassedValidation = hasPassedValidation && isValid
            validationResponse = { 
                ...validationResponse,
                ...standardValidationResponse(rule, isValid, validationMessage[rule]?.passed || 'Validation Passed', validationMessage[rule]?.failed || 'Validation Failed'),
        
            }
        }

        if (rule === 'is_null') {
            let isValid = target === null
            hasPassedValidation = hasPassedValidation && isValid
            validationResponse = { 
                ...validationResponse,
                ...standardValidationResponse(rule, isValid, validationMessage[rule]?.passed || 'Validation Passed', validationMessage[rule]?.failed || 'Validation Failed'),
        
            }
        }

        if (rule === 'is_array') {
            let isValid = Array.isArray(target)
            hasPassedValidation = hasPassedValidation && isValid
            validationResponse = { 
                ...validationResponse,
                ...standardValidationResponse(rule, isValid, validationMessage[rule]?.passed || 'Validation Passed', validationMessage[rule]?.failed || 'Validation Failed'),
        
            }
        }
    })

    validationResponse = { 
        ...validationResponse, 
        all: {
            isValidated: hasPassedValidation,
            message: hasPassedValidation ? 'Validation Passed' : 'Validation Failed'
        }
    }

    return validationResponse
}