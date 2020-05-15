



# address-plugins

This is a set of React plugins designed to try and make internationalisation of address forms as easy and simple as possible. It was designed to mesh with a backend inspired by the [OASIS CIQ TC Standard xAL.](https://www.immagic.com/eLibrary/ARCHIVES/TECH/OASIS/XAL_V2.PDF)

## Installation
These are React NPM plugins, and as such, you will need to include them in you project's package.json file.
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
When researching address forms for our project ReShare, we came across the problem that addresses are constructed differently all over the world. The standard mentioned in the link above aims to solve this problem. However in constructing a frontend to match this kind of data model, we realised that this must be a problem that crops up a lot, and so decided to write as standalone code as possible, so that our solution can be reused in other applications.

## Data Model
The particular flavour of address model our backend uses comprises of an `Address`, containing many `AddressLines`, an `AddressLabel` string and a `CountryCode` string, corresponding to an ISO 3166-2 code (Or `"generic")`.
`AddressLines` contain
 - a `value` String
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

:warning: This backend setup has an important restriction, in that each address is supposed to be limited to **ONE** of any given type of `AddressLine`. The ways in which the various types can be used is expanded on in the standard. :warning:

### Dealing with deletion registration
We have built this in so instead of simply omitting a field from a form on deletion, we send the field with a `_delete: true` flag. This may not exactly match your backend configuration for dealing with this, and so you may need to write your own interpreters for the form's output.

## The plugin
Each plugin, say `@folio/address-plugin-generic` or `@folio/address-plugin-north-america`, is named for a particular "sensible" domain sharing an address format.
For example the addresses of the US and Canada are similar, up to field names, and so it makes sense to bundle these together. Similarly most of the British Isles share an address format, and so there is a single plugin for those.
The definition of sensible is really up to whoever is writing the particular plugin, but a good rule of thumb would be to stick within continents at the highest level, and nations at the lowest level.

A plugin shouldn't have to be smart enough to deal with hundreds of address formats, `address-plugin-africa` is probably too ambitious of a scope, but should be smart enough to deal with changes within a nation, you don't want 4 plugins `address-plugin-foo-north`, `address-plugin-foo-south`, `address-plugin-foo-east`, `address-plugin-foo-west`. That should be dealt with internally.

:warning: Note to developers. If you wish to develop a plugin to fit into this set, it is highly recommended that you spend some time looking at an existing plugin to see exactly what you'll have to mirror. :warning:

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
`AddressField` takes 5 props:
- country
- name
- requiredValidator
- savedAddress
- textFieldComponent

**Country**
In those cases where a single plugin is used for multiple different countries, the `country` prop will be used to call the correct field labels. For example in `address-plugin-north-america` passing `country="Canada"` will result in the `AdministrativeArea` field being labelled `Province`, and passing `country="USA"` will result in `AdministrativeArea` field being labelled `State`.

This happens via React-Intl's `FormattedMessage` component. Wherever a plugin's field names may need to change country by country, the field labels should be called in the following way:
```
label={<FormattedMessage  id={`ui-address-plugin-north-america.${country}.locality`}  />}
```
The acceptable inputs for `country` here should match the outputted `listOfSupportedCountries`.


When a country is selected, the `country` field should pre-populate with the chosen country's translated name. If `country` was explicitly passed in with the `savedAddress` however, that data will take precedence.

**Name**
`name` will be prepended to the field names, such as `"${name}.locality"` etc.

For example you might want to call:

```
<plugin.addressFields
	name="address"
	...
/>
```
if these address fields sit within a larger form and you wish to group their output together together or `name={"address[index]}` if you need an array of them.

In these examples the output would take the shape:
```
address: {
	locality: "foo",
	postalCode: "bar"
}
```
or 
```
address: [
	{
		locality: "foo",
		postalCode: "bar"	
	},
	...
]
```


**RequiredValidator**
`requiredValidator` takes a function, which will be run on each field marked as `required`. A simple example might be

```
const  required = value => (
  !value ? "missing value" : undefined
);
```
This would then flag any `required` fields missing data with the text `missing value` on submittal.

The idea here is that if your function returns a falsy value then validation is deemed to have passed.

**SavedAddress**
`savedAddress` takes an address object of the [correct shape](#address-shape), which it will then pass to `backendToFields`, and finally be used line by line to fill out the initialValues for each line's Field.

**TextFieldComponent**
Finally, `textFieldComponent` is what the Field will use to display an input box. Simplest case is 
```
<plugin.AddressField
  textFieldComponent="input"
  ...
/>
```
This will use finalForm's built in `input`. You can pass a custom component here if you wish.


#### Field labels
Right now we only have internationalised field labels for en_US, and there may be some work to do on your project's end to utilise those. The idea in future is that if you were accessing `address-plugin-north-america` US fields from France, that you would see "Etat" in place of "State", or if you were accessing the `address-plugin-north-america` Canada fields from 
Germany you'd see "Provinz" in place of "Province".

### backendToFields

This is a function: `backendToFields` that the `AddressFields` component uses to massage the data held in `savedAddress` into a shape the fields can read and use as initial values for the form. It accepts addresses of the [correct shape](#address-shape).

### fieldsToBackend
This is a function: `fieldsToBackend` that does the opposite, takes the output from the fields, and reshapes it into something the backend will accept. In the most basic case, the plugin for `"Foo"` will simply take the flattened `{premise: "A", locality: "B", ...}` shape and translate that to
```
{
	countryCode: "foo",
	lines: [
		{
			type: {
				value: "Premise",
			},
			value: "A"
		},
		{
			type: {
				value: "Locality",
			},
			value: "B"
		},
	]
}
```
In the cases though where a field is _not_ required, it will do the above if a field is filled, else call an `address-utils` function, `deleteFieldIfExists`, to remove any existing data. This is the part that may not be compatible with all backend setups, so extra massaging may be required.

Extra magic might occur here, but that should be covered in each `address-plugin`'s README.

### listOfSupportedCountries
This is simply an array, containing a list of countries for which this plugin supports. 
This list **MUST** contain the ISO 3166-2 codes of countries the plugin supports. For example the output for `address-plugin-british-isles` is `["GB-ENG", "GB-SCT", "GB-WLS", "GB-NIR"]`,  and the output for `address-plugin-north-america` is `["US", "CA"]`. These are used for the plugin translations (where there is a need to differ by country), e.g. `"US.countryCode": "USA",` and `"CA.administrativeArea": "Province",`

### fieldOrder
This is an object, with keys corresponding to the standard addressLine types [above](#data-model), and values corresponding to their ordering in a written address.
For example the `address-plugin-british-isles` `fieldOrder` object looks like this:
```
const  fieldOrder = {
	"Premise":  0,
	"Thoroughfare":  1,
	"PostalCodeOrTown":  2,
	"Locality":  3,
	"AdministrativeArea":  4,
	"PostalCode":  5,
	"Country":  6
}
```
The ordering should match the order you'd expect to see those fields in if you were to display the address.

We can then use this for building the address later in a `ViewAddress` component (FUTURE RELEASE), or potentially use it to save the order to the backend, if that's something your backend necessitates.

It's shaped like this as it seemed preferable to search for a key and return a value than to iterate over an array such as `[Premise, Thoroughfare,...]` and return an index.

### pluginName
Finally we also export a simple String containing the plugin's name, i.e. `address-plugin-north-america`. This can be used to access the plugin's own translation codes inside your own project.

## Address Shape

The minimum shape expected by the frontend fields is:

```
{
  countryCode: "GB-ENG"
  lines: [
    {
      id: "some_id",
      type: {
        value: "department"
      },
      value: "Shipping department"
    },
    ...
  ]
}
```
with each `AddressLine` being an object on the `lines` array, comprising of an `id`, a `type` object containing a `value` string, and a `value` string itself.

A saved address is expected to have a `countryCode`, in ISO 3166-2 form. The above example is the subdivided code for England, which we use here in place of the general ISO code `GB` for greater specification.

## Known Issues
When changing an address's country format to one with more fields, everything _should_ work as expected. However, we currently don't have a built in process to remove fields that a particular format might not include.

For example, filling out a UK address with a `Town` field will place that information into a `postalCodeOrTown` `AddressLine`, but then switching that address to a US one, the field will be missing from the form, but the backend data massagers do not know to remove something from `postalCodeOrTown` if it exists. This is not priority work for now, but shouldn't be too hard to fix.

## Other READMEs
As mentioned above, this is really a _set_ of plugins and components, so I'll include here links to all the specific READMEs for the individual plugins/repos, and attempt to keep it up to date as new ones are added.

 - [address-utils](https://github.com/openlibraryenvironment/address-utils/blob/master/README.md)
 - [address-plugin-north-america](https://github.com/openlibraryenvironment/address-plugin-north-america/blob/master/README.md)
 - [address-plugin-british-isles](https://github.com/openlibraryenvironment/address-plugin-british-isles/blob/master/README.md)
