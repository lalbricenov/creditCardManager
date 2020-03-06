// This script add a red asterisk in front of the label for required fields in a form
let forms = document.getElementsByTagName("form");
for(form of forms)
{
    let elems = form.elements;
    for(elem of elems)
    {
        if(elem.attributes.required)
        {
            let label = elem.parentElement.getElementsByTagName("label")[0];
            if(label)
                label.innerHTML = label.innerHTML + "<span style='color:red;'> *</span>";
        }
        
    }
}