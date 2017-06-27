import React, { Component } from 'react'
import { Link } from 'react-router'
import cx from 'classnames'

import Button from 'metabase/components/Button'
import Icon from 'metabase/components/Icon'
import Input from 'metabase/components/Input'
import Select from 'metabase/components/Select'
import CheckBox from 'metabase/components/CheckBox'

const SelectClasses = 'h3 border-dark shadowed p2'

export default class FieldApp extends Component {
    render () {
        return (
            <div className="relative">
                <div className="wrapper wrapper--trim">
                    <BackButton table={{ name: 'Orders' }} />

                    <Section>
                        <FieldHeader
                            name="Order status"
                            description="The status of the order"
                        />
                    </Section>

                    <Section>
                        <FieldType />
                    </Section>

                    <Section>
                        <FieldVisibility />
                    </Section>

                    <Section>
                        <FieldRemapping />
                    </Section>

                    <Section>
                        <FieldBinning />
                    </Section>
                    { /*
                    <Section>
                        <FieldCache />
                    </Section>
                    */}
                </div>
            </div>
        )
    }
}

const BackButton = ({ table }) =>
    <div
        className="circle text-white p2 mt3 ml3 flex align-center justify-center  absolute top left"
        style={{ backgroundColor: '#8091AB' }}
    >
        <Icon name="backArrow" />
    </div>

class FieldCache extends Component {
    render () {
        return (
            <div>
                <SectionHeader title="Cache settings" description="Set how frequently Metabase checks for new field values" />
                <Select
                    className={SelectClasses}
                    value={{ name: 'Daily' }}
                    options={[{}, {}]}
                />
                <div className="mt2 text-danger text-bold cursor-pointer flex align-center">
                    <Icon
                        name="refresh"
                        className="mr1"
                    />
                    Reset cache
                </div>
            </div>
        )
    }
}

class FieldVisibility extends Component {
    render () {
        return (
            <div>
                <SectionHeader title="Visibility" description="Where this field will appear throughout Metabase" />
                <Select
                    className={SelectClasses}
                    value={{ name: 'Everywhere' }}
                    options={[{}, {}]}
                />
            </div>
        )
    }
}

const SelectSeparator = () =>
    <Icon
        name="chevronright"
        size={12}
        className="mx2 text-grey-3"
    />

class FieldType extends Component {
    render () {
        return (
            <div>
                <SectionHeader title="Type" />
                <div className="flex align-center">
                    <Select
                        className={SelectClasses}
                        value={{ name: 'Foreign Key' }}
                        options={[{}, {}]}
                    />
                    <SelectSeparator />
                    <Select
                        className={SelectClasses
                        }value={{ name: 'Order Statuses' }}
                        options={[{}, {}]}
                    />
                </div>
            </div>
        )
    }
}

class FieldHeader extends Component {
    render () {
        const { name, description, fieldType } = this.props
        return (
            <div>
                <Input
                    className="h1 AdminInput bordered rounded border-dark block mb1"
                    value={name}
                />
                <Input
                    className="text AdminInput bordered input text-measure block"
                    value={description}
                />
            </div>
        )
    }
}

class ValueMaps extends Component {
    render () {
        const { valueMaps } = this.props
        return (
            <div className="bordered rounded p2 border-dark ">
                <div className="flex align-center my1 pb2 border-bottom">
                    <h3>Original value</h3>
                    <h3 className="ml-auto">Mapped value</h3>
                </div>
                <ol>
                    { valueMaps.map(pair =>
                        <li className="mb1">
                            <FieldValueMapping
                                original={pair.original}
                                mapped={pair.mapped}
                                onSetMap={() => console.log('map') }
                            />
                        </li>
                    )}
                </ol>
            </div>
        )
    }
}
class FieldValueMapping extends Component {
    render () {
        const { original, mapped, onSetMap } = this.props
        return (
            <div className="flex align-center">
                <h3>{original}</h3>
                <Input
                    className="AdminInput input ml-auto"
                    value={mapped}
                    onChange={onSetMap}
                />
            </div>
        )
    }
}

const Section = ({ children }) => <section className="my3">{children}</section>

const SectionHeader = ({ title, description }) =>
    <div className="border-bottom py2 mb2">
        <h2 className="text-italic">{title}</h2>
        { description && <p className="mb0 text-grey-4 mt1 text-paragraph text-measure">{description}</p> }
    </div>

const MAP_OPTIONS = [
    { name: 'Use original value' },
    { name: 'Use foreign key' },
    { name: 'Custom mapping' }
]

class FieldRemapping extends Component {
    state = {
        mappingType: MAP_OPTIONS[1]
    }

    render () {
        return (
            <div>
                <SectionHeader
                    title='Display values'
                    description="Choose to show the original value from the database, or have this field display associated or custom information."
                />
                <Select
                    className={SelectClasses}
                    value={this.state.mappingType}
                    onChange={mappingType => this.setState({ mappingType })}
                    options={MAP_OPTIONS}
                />
                { this.state.mappingType === MAP_OPTIONS[1] && [
                    <SelectSeparator />,
                    <Select
                        className={SelectClasses}
                        value={{ name: 'Status name (entity key)' }}
                        options={MAP_OPTIONS}
                    />
                ]}
                { this.state.mappingType === MAP_OPTIONS[2] && (
                    <div className="mt3">
                        <ValueMaps valueMaps={[
                            { original: -1, mapped: 'Returned'  },
                            { original: 1, mapped: 'Processing' },
                            { original: 2, mapped: 'Fulfilled'  },
                        ]}/>
                    </div>
                )}
            </div>
        )
    }
}

class FieldBinning extends Component {
    render () {
        return (
            <div>
                <SectionHeader title="Bins" />

                <ol>
                    <li className="mb1">
                        <Bin
                            name="Default"
                            enabled={true}
                        />
                    </li>
                    <li className="mb1">
                        <Bin
                            name="My custom bin"
                            enabled={false}
                            expanded={true}
                        />
                    </li>
                </ol>
            </div>
        )
    }
}

const BinStrategy = ({ name, selected, children }) =>
    <div className="relative">
        <div
            className={cx(
                'circle bordered absolute',
                { 'bg-brand border-brand': selected },
                { 'bg-white': !selected }
            )}
            style={{ borderWidth: 2, width: 20, height: 20 }}
        >
        </div>
        <div className="ml3">
            <h3>{name}</h3>
            { selected && children && <div className="mt2">{children}</div> }
        </div>
    </div>


const BinFormLabel = ({ children }) =>
    <h4 className="text-italic mb1">{children}</h4>

const Bin = ({ name, enabled, expanded }) =>
    <div className="bordered border-dark p3 rounded text-measure">
        <div className={cx({ 'flex align-center': !expanded })}>
            { !expanded && <CheckBox checked={enabled} /> }
            { expanded
                ? [
                    <BinFormLabel>Name</BinFormLabel>,
                    <Input
                        className="AdminInput input block full"
                        type="text"
                        value={name}
                    />
                ]
                : <h3 className="ml1">{name}</h3>
            }
            { expanded && (
                <div className="mt2">
                    <BinFormLabel>Bin Strategy</BinFormLabel>
                    <ol>
                        <li className="mb1">
                            <BinStrategy name="Natural" selected={false} />
                        </li>
                        <li className="mb1">
                            <BinStrategy
                                name="Pick size"
                                selected={true}
                            >
                                <div className="Grid Grid--1of3 Grid--gutters Grid--fit">
                                    <div className="Grid-cell">
                                        <BinFormLabel>Min</BinFormLabel>
                                        <Input className="input flex" placeholder="0" />
                                    </div>

                                    <div className="Grid-cell">
                                        <BinFormLabel>Max</BinFormLabel>
                                        <Input className="input flex" placeholder="100" />
                                    </div>

                                    <div className="Grid-cell">
                                        <BinFormLabel>Bin width</BinFormLabel>
                                        <Input className="input flex" placeholder="100" />
                                    </div>
                                </div>
                            </BinStrategy>
                        </li>
                        <li className="mb1">
                            <BinStrategy name="Pick number of bins" selected={false} />
                        </li>
                        <li className="mb1">
                            <BinStrategy name="Custom" selected={false} />
                        </li>
                    </ol>
                    <div className="flex align-center mt2">
                        <div className="ml-auto">
                            <Button borderless>Cancel</Button>
                            <Button primary>Save</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
