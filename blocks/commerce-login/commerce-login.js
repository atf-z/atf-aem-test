/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
import { SignIn } from '@dropins/storefront-auth/containers/SignIn.js';
import { render as authRenderer } from '@dropins/storefront-auth/render.js';
import { events } from '@dropins/tools/event-bus.js';
import { checkIsAuthenticated } from '../../scripts/configs.js';
import { CUSTOMER_FORGOTPASSWORD_PATH, CUSTOMER_ACCOUNT_PATH } from '../../scripts/constants.js';
import { rootLink } from '../../scripts/scripts.js';

// Initialize
import '../../scripts/initializers/auth.js';

export default async function decorate(block) {
  if (checkIsAuthenticated()) {
    window.location.href = rootLink(CUSTOMER_ACCOUNT_PATH);
  } else {
    await authRenderer.render(SignIn, {
      routeForgotPassword: () => rootLink(CUSTOMER_FORGOTPASSWORD_PATH),
      routeRedirectOnSignIn: () => rootLink(CUSTOMER_ACCOUNT_PATH),
    })(block);

    /**
     * add custom text
     */
    const loginTextContainer = block.querySelector('.dropin-header-container.auth-sign-in-form__title');
    if (loginTextContainer) {
      const loginText = document.createElement('p');
      loginText.innerText = 'If you have an account, sign in with your email address.';
      loginText.classList.add('login-text');
      loginTextContainer.after(loginText);
    }

    events.on(
      'aem/lcp',
      () => {
        /**
         * Hide show/hide password
         */
        const $eye = document.querySelector('.dropin-input-password__eye-icon');
        $eye.style.display = 'none';

        /**
         * add label for email and password
         */
        const $email = document.querySelector('.auth-sign-in-form__form__field--email .dropin-input-label-container');
        const $password = document.querySelector('.auth-sign-in-form__form__password .dropin-input-label-container');

        const emailLabel = document.createElement('p');
        emailLabel.innerText = 'Email.';
        $email.prepend(emailLabel);

        const passwordLabel = document.createElement('p');
        passwordLabel.innerText = 'Password.';
        $password.prepend(passwordLabel);
      },
      { eager: true },
    );
  }
}
