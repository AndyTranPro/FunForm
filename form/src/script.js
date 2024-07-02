document.addEventListener('DOMContentLoaded', (event) => {
    // define all global constants
    const MAX_LENGTH = 50;
    const MIN_LENGTH = 3;

    // get all input elements
    const streetNameInput = document.getElementById('street-name');
    const suburbInput = document.getElementById('suburb');
    const postcodeInput = document.getElementById('postcode');
    const dobInput = document.getElementById('dob');
    const buildingTypeSelect = document.getElementById('building-type');
    const featuresCheckboxes = document.querySelectorAll('input[name="features"]');
    const selectAllButton = document.getElementById('select-all-btn');
    const resetButton = document.getElementById('reset-form');
    const resultTextarea = document.getElementById('form-result');

    // render function
    const render = () => {
        const streetName = streetNameInput.value;
        const suburb = suburbInput.value;
        const postcode = postcodeInput.value;
        const dob = dobInput.value;
        const buildingType = (buildingTypeSelect.value === 'apartment' ? 'an' : 'a') + ' ' + capitalize(buildingTypeSelect.value);
        const selectedFeatures = Array.from(featuresCheckboxes).filter(cb => cb.checked).map(cb => cb.value);

        // Update the select all button text if all features are selected
        selectAllButton.value = selectedFeatures.length === featuresCheckboxes.length ? 'Deselect All' : 'Select All';

        // validate inputs and return the text result
        if (!streetName || streetName.length < MIN_LENGTH || streetName.length > MAX_LENGTH) {
            resultTextarea.value = 'Please input a valid street name';
        } else if (!suburb || suburb.length < MIN_LENGTH || suburb.length > MAX_LENGTH) {
            resultTextarea.value = 'Please input a valid suburb';
        } else if (!postcode || !/^[0-9]{4}$/.test(postcode)) {
            resultTextarea.value = 'Please input a valid postcode';
        } else if (!dob || calculateAge(dob) == -1 || !/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/.test(dob)) {
            resultTextarea.value = 'Please enter a valid date of birth';
        } else {
            const age = calculateAge(dob);
            const featuresText = formatFeatures(selectedFeatures);
            resultTextarea.value = `You are ${age} years old, and your address is ${streetName} St, ${suburb}, ` +
            `${postcode}, Australia. Your building is ${buildingType}, and it has ${featuresText}`;
        }
    };

    // function for calculating the user's age
    const calculateAge = (dob) => {
        // parse the date input
        const parts = dob.split('/');
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
    
        // greate a date object for the birth date
        const birthDate = new Date(year, month, day);
        
        // validate the date
        // check if 0 < day < 32, 0 < month < 13
        if (birthDate.getFullYear() !== year || birthDate.getMonth() !== month || birthDate.getDate() !== day) {
            return -1;
        }
    
        // get the current date
        const today = new Date();
    
        // calculate age
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth(); 
    
        // if current month < birth month or same month but current day < day of dob, subtract 1 from age
        // since the person has not had their birthday yet
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
    
        return age;
    }

    // function for formatting features
    const formatFeatures = (features) => {
        let formattedFeatures = features.length == 0 ? 'no features' : features[0];
        return features.length > 1 ? features.slice(0, -1).join(', ') + ', and ' 
        + features[features.length - 1] : formattedFeatures;
    };

    // function for capitalizing the first letter of a string
    const capitalize = (string) => {return string[0].toUpperCase() + string.slice(1)};

    // actions for input elements
    streetNameInput.addEventListener('blur', render);
    suburbInput.addEventListener('blur', render);
    postcodeInput.addEventListener('blur', render);
    dobInput.addEventListener('blur', render);
    buildingTypeSelect.addEventListener('change', render);
    featuresCheckboxes.forEach(cb => cb.addEventListener('change', render));

    // selecting all features
    selectAllButton.addEventListener('click', () => {
        // check if all features are checked
        const allChecked = Array.from(featuresCheckboxes).every(cb => cb.checked);
        // if they are all checked, uncheck all, otherwise check all
        featuresCheckboxes.forEach(cb => cb.checked = !allChecked);
        render();
    });

    // resetting the form
    resetButton.addEventListener('click', () => {
        resultTextarea.value = '';
        streetNameInput.value = '';
        suburbInput.value = '';
        postcodeInput.value = '';
        dobInput.value = '';
        buildingTypeSelect.value = 'apartment';
        featuresCheckboxes.forEach(cb => cb.checked = false);
        selectAllButton.value = 'Select All';
    });
});
