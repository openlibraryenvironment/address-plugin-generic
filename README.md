


# address-plugins

This is a set of react plugins designed to try and make internationalisation of address forms as easy and simple as possible. It was designed to mesh with a backend inspired by the [OASIS CIQ TC Standard xAL.](https://www.immagic.com/eLibrary/ARCHIVES/TECH/OASIS/XAL_V2.PDF)

## Installation
These are react npm plugins, and as such, you will need to include them in you project's package.json file.
The minimum import to get a form up and running is:
```
"@folio/address-utils": "^1.0.0",
"@folio/address-plugin-generic": "^1.0.0"
```

To call these plugins in your code, you would then include:

```
import  pluginGeneric from '@folio/address-plugin-generic';
```

and call `<pluginGeneric.addressFields>`, say, to use the component `AddressFields` for this plugin.

## Motivation
When researching address forms for our project Re:Share, we came across the problem that addresses are constructed differently all over the world. The standard mentioned in the link above aims to solve this problem. However in constructing a frontend to match this kind of data model, we realised that this must be a problem that crops up a lot, and so decided to write as standalone code as possible, so that our solution can be reused in other applications.

## Data Model
The particular flavour of address model our backend uses comprises of an `Address`, containing many `AddressLines` and an `AddressLabel` string.
`AddressLines` contain
 - a `value` String
 - a `seq` Long
 - a `type` RefdataValue, taking one of the values:
```
- AdministrativeArea
- Country
- Department
- Thoroughfare
- Locality
- PostalCode
- PostBox
- PostOffice
- PostalCodeOrTown
- Premise
```
It is heavily recommended that any potential user do some reading of the standard above in order to understand what each of these can mean/be used for.

### Backend particulars
It is worth mentioning here that our backend solution is built in a way such that `POST` requests are cumulative, and so instead of removing a field from a form, we send along the field with a `_delete: true` flag. This will likely not be universal, and so you may need to write your own interpreters for the form's output.

## The plugin
Each plugin, say `@folio/address-plugin-generic` or `@folio/address-plugin-usa` is named using the ISO standard 3 character country name as found [here](https://www.iban.com/country-codes).
The plugins comprise of three main parts. 

### AddressFields
First and foremost is an `AddressFields` component, which returns a collection of [`final-form`](https://final-form.org/docs/final-form/getting-started) Fields, ready for insertion into an existing `Form`. (At some point in the future we may include a basic `Form` wrapper along with `address-utils`, but this is not in place yet).

These `Fields` will tend to stick to the field names as detailed above, so that you can expect a submitted object to look like:
```
address: {
  premise: "<user input>",
  thoroughfare: "<user input>",
  ...
}
```
and so on. There are some exceptions to this, which individual plugin READMEs should detail.

#### Props
`AddressField` takes 4 props:
- name
- requiredValidator
- savedAddress
- textFieldComponent

`name` is for use inside an existing form. For example you might want to call:

```
<plugin.addressFields
	name="address"
	...
/>
```
if these address forms sit within a larger form, or `name={"address[index]}` if you need an array of them.

This `name` will be prepended to the field names, such as `"${name}.locality"` etc.


`requiredValidator` takes a function, which will be run on each field marked as `required`. A simple example might be

```
const  required = value => (
  !value ? "missing value" : undefined
);
```
This would then flag any `required` fields missing data with the text `missing value` on submittal.

`textFieldComponent` is what the Field will use to display an input box. Simplest case is 
```
<plugin.AddressField
  textFieldComponent="input"
  ...
/>
```
This will use finalForm's built in `input`. You can pass a custom component here if you wish.

Finally `savedAddress` currently expects an address of the [correct shape](##AddressShape), which it will then pass to `backendToFields` to use as initial values for the fields.

#### Field labels
Right now we only have internationalised field labels for en_US, and there may be some work to do on your project's end to utilise those. The idea in future is that if you were accessing `address-plugin-usa` fields from France, that you would see "Etat" in place of "State", or if you were accessing the `address-plugin-can` fields from 
Germany you'd see "Provinz" in place of "Province".

### Backend to Fields
This is a component that the `AddressFields` component uses to massage the data held in `savedAddress` into a shape the fields can read and use as initial values for the form.

### Fields to Backend
This is a component that does the opposite, takes the output from the fields, and reshapes it into something the backend will accept. In the most basic cases it will simply take the flattened `{locality: "A", premise: "B", ...}` shape and translate that to
```
{
	lines: [
		{
			seq: 0,
			type: {
				value: "Locality",
			},
			value: "A"
		},
		{
			seq: 1,
			type: {
				value: "Premise",
			},
			value: "B"
		},
	]
}
```
In the cases though where a field is _not_ required, it will do the above if a field is filled , else call an `address-utils` component, `deleteFieldIfExists`, to remove any existing data. This is the part that may not be compatible with all backend setups, so extra massaging may be required.

Extra magic might be occur here, but that should be covered in each `address-plugin`'s README.

## Address Shape

The minimum shape expected by the frontend fields is:

```
{
  lines: [
    {
      id: "some_id",
      seq: 2,
      type: {
        value: "department"
      },
      value: "Shipping department"
    },
    ...
  ]
}
```
with each `AddressLine` being an object on the `lines` array, comprising of an `id`, a `seq`, a `type` object containing a `value` string, and a `value` string itself.
