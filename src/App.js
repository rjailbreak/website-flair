import React, { Component } from 'react';
import {
    Button,
    Grid,
    Row,
    Col,
    DropdownButton,
    MenuItem,
    Tooltip,
    OverlayTrigger,
} from 'react-bootstrap';
import _ from 'lodash';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                subreddits: {},
                devices: {},
                versions: {},
            },
            mySub: null,
            myDevice: null,
            myVersion: null,

        }
        this.updateDropdown = this.updateDropdown.bind(this);
    }

    componentDidMount() {
        fetch("https://raw.githubusercontent.com/rjailbreak/flairbot/master/data.json")
            .then(response => response.text())
            .then(body => {
                this.setState({
                    data: JSON.parse(body),
                });
            });
    }

    renderDeviceDropdown(devices, title, id) {
        // Loop through the three types of devices
        const items = _.map(Object.keys(devices), (type) => {
            return _.concat(
                <MenuItem header key={type}>{type}</MenuItem>,
                _.map(Object.keys(devices[type]), (device) => {
                    return (
                        <MenuItem eventKey={device} key={device}>
                            {devices[type][device]}
                        </MenuItem>
                    );
                })
            );
        });

        for (let type in this.state.data.devices) {
            if (this.state.data.devices[type][this.state.myDevice]) {
                title = this.state.data.devices[type][this.state.myDevice];
            }
        }
        return (
            <DropdownButton
                bsStyle='default'
                title={title}
                id={id}
                onSelect={(e) => this.updateDropdown(e, id)}
            >
                {items}
            </DropdownButton>
        )
    }

    renderSimpleDropdown(obj, title, id) {
        // console.log(id, obj);
        const items = _.map(Object.keys(obj), (o) => {
            return (
                <MenuItem eventKey={o} key={o}>
                    {obj[o]}
                </MenuItem>
            );
        });
        return (
            <DropdownButton
                bsStyle='default'
                title={obj[this.state[id]] ? obj[this.state[id]] : title}
                id={id}
                onSelect={(e) => this.updateDropdown(e, id)}
            >
                {items}

            </DropdownButton>
        )
    }

    renderSubmitButton() {
        console.log(this.state.mySub, this.state.myDevice, this.state.myVersion);
        const tooltip = (
            <Tooltip id="tooltip">
                Each option need a selection
            </Tooltip>
        );
        return (this.state.mySub && this.state.myDevice && this.state.myVersion) ?
            (
                <Button
                    bsStyle="success"
                    rel="noopener noreferrer"
                    href={`http://www.reddit.com/message/compose/?to=jailbreakflairbot&subject=Flair%20Request&message=0${this.state.myDevice}%0A1${this.state.myVersion}%0A2${this.state.mySub}%0A%0ADo%20not%20edit%20anything%20in%20this%20message%20or%20the%20bot%20will%20fail.`}
                >
                    Submit
                </Button>
            ) : (
                <OverlayTrigger placement="top" overlay={tooltip}>
                    <Button>Submit</Button>
                </OverlayTrigger>
            );
    }

    updateDropdown(e, id) {
        this.setState({
            [id]: e
        })
    }

    render() {
        return (
            <div className="App container">
                <h2>Flair selector for r/jailbreak and r/iOSthemes</h2>
                <p>
                    <strong>The bot is online and will run every 10 minutes</strong>
                </p>
                <p>
                    This tool uses the u/JailBreakFlairBot Reddit bot which
                    assists <a href="http://reddit.com/r/jailbreak">r/jailbreak</a> and <a href="http://reddit.com/r/iosthemes/">r/iOSthemes</a> in
                    creating custom flairs. Below, you may select the device and iOS
                    version of your primary device. The page will re-direct you to send a message to the bot. All you need to do after logging into
                    your reddit account, is hit send. If you edit anything in the message, the bot will not understand your request and your flair will be rejected.
                </p>
                <p>
                    <strong>Developers & Designers:</strong> Please be aware that if you have Developer flair and submit using this website,
                    your Developer flair will be replaced with your new flair. Similarly, your Designer flair will be replaced with your new flair. <br />If you have released a tweak on a default repository and would like Developer flair,
                    please <a rel="noopener noreferrer" target="_blank" href={`http://www.reddit.com/message/compose?to=%2Fr%2Fjailbreak&subject=Developer%20Flair%20Request%20${_.random(100000)}`}>message the moderators</a> with
                    links to the package depiction as proof. If you have released a theme on a default repository and would like Designer flair,
                    please <a rel="noopener noreferrer" target="_blank" href={`http://www.reddit.com/message/compose?to=%2Fr%2FiOSthemes&subject=Designer%20Flair%20Request%20${_.random(100000)}`}>message the moderators</a> with
                    links to the theme depiction as proof.
                </p>
                <p>
                    Unfortunately, this will not work with the mobile app. Access this page through a web browser.
                </p>
                <Grid fluid>

                    <Row style={{ marginTop: '30px' }}>
                        <Col md={3}>
                            {this.renderSimpleDropdown(this.state.data.subreddits, 'Select subreddit', 'mySub')}
                        </Col>
                        <Col md={3}>
                            {this.renderDeviceDropdown(this.state.data.devices, 'Select Device', 'myDevice')}
                        </Col>
                        <Col md={3}>
                            {this.renderSimpleDropdown(this.state.data.versions, 'Select version', 'myVersion')}
                        </Col>
                        <Col md={3}>
                            {this.renderSubmitButton()}
                        </Col>
                    </Row>
                </Grid>
            </div >
        );
    }
}