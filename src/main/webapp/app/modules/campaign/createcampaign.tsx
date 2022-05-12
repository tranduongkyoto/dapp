import React, { useEffect, useState } from 'react';
import { Button, Col, Row } from 'reactstrap';
import { Translate, translate } from 'react-jhipster';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { locales, languages } from 'app/config/translation';
import './campaign.scss';
const CreateCampaign = () => {
  const [key1, setKey1] = useState(1);
  const [key2, setKey2] = useState(2);
  const [key3, setKey3] = useState(3);
  const [key4, setKey4] = useState(4);

  const handleValidSubmit = (event, values) => {
    console.log(values);
    setKey1(key1 - 1);
    setKey2(key2 * 2);
    setKey3(key3 * 3);
    setKey4(key4 + 1);

    //event.persist();
  };
  return (
    <>
      <Row className="justify-content-center main">
        <div className="col-md-4 col-sm-12">
          <img
            style={{
              maxWidth: '90%',
              height: 'auto',
            }}
            alt=""
            src="content/images/bluezoneApp.png"
          ></img>
        </div>
        <Col md="6">
          <h2 id="settings-title">
            <Translate contentKey="settings.title" interpolate={{ username: 'Campaign' }}>
              User settings for
            </Translate>
          </h2>
          <AvForm id="settings-form" onValidSubmit={handleValidSubmit} ke>
            {/* First name */}
            <AvField
              className="form-control"
              name="name"
              label={translate('settings.form.firstname')}
              id="name"
              placeholder={translate('settings.form.firstname.placeholder')}
              validate={{
                required: { value: true, errorMessage: translate('settings.messages.validate.firstname.required') },
                minLength: { value: 1, errorMessage: translate('settings.messages.validate.firstname.minlength') },
                maxLength: { value: 50, errorMessage: translate('settings.messages.validate.firstname.maxlength') },
              }}
              // value={test.firstName}
              data-cy="firstname"
              key={String(key1)}
            />
            {/* Last name */}
            <AvField
              className="form-control"
              name="des"
              label={translate('settings.form.lastname')}
              id="des"
              placeholder={translate('settings.form.lastname.placeholder')}
              validate={{
                required: { value: true, errorMessage: translate('settings.messages.validate.lastname.required') },
                minLength: { value: 1, errorMessage: translate('settings.messages.validate.lastname.minlength') },
                maxLength: { value: 50, errorMessage: translate('settings.messages.validate.lastname.maxlength') },
              }}
              // value={test.lastName}
              data-cy="lastname"
              key={String(key2)}
            />
            {/* Email */}
            <AvField
              name="email"
              label={translate('global.form.email.label')}
              placeholder={translate('global.form.email.placeholder')}
              type="email"
              validate={{
                required: { value: true, errorMessage: translate('global.messages.validate.email.required') },
                minLength: { value: 5, errorMessage: translate('global.messages.validate.email.minlength') },
                maxLength: { value: 254, errorMessage: translate('global.messages.validate.email.maxlength') },
              }}
              // value={test.email}
              data-cy="email"
              key={String(key3)}
            />
            {/* Language key */}
            <AvField
              type="select"
              id="langKey"
              name="langKey"
              className="form-control"
              label={translate('settings.form.language')}
              // value={test.langKey}
              data-cy="langKey"
              key={String(key4)}
            >
              {locales.map(locale => (
                <option value={locale} key={locale}>
                  {languages[locale].name}
                </option>
              ))}
            </AvField>
            <Button color="primary" type="submit" data-cy="submit">
              <Translate contentKey="settings.form.button">Save</Translate>
            </Button>
          </AvForm>
        </Col>
        <Col md="2"></Col>
      </Row>
    </>
  );
};

export default CreateCampaign;
