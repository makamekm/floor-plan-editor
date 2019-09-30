import debounce from "debounce";
import firebase from "firebase/app";
import { computed, observable, reaction } from "mobx";
import { useEffect } from "react";
import "../utils/firebase";
import { IRootService } from "./root-sevice.interface";
import { useDisposable } from "mobx-react-lite";
import { useRouter, NextRouter } from "next/router";
import { useRouterChange } from "../utils/router-hook";

export class UserService implements IRootService {
  @observable public loading: boolean = true;
  @observable public askToLogIn: boolean = false;
  @observable private data: {
    user: firebase.User;
  } = {
    user: null,
  };
  private router: NextRouter;

  @computed get user() {
    return this.data.user;
  }
  @computed get isLogin() {
    return !!this.data.user && !this.loading;
  }
  @computed get isOpenLoginDialog() {
    return this.askToLogIn && !this.data.user && !this.loading;
  }

  private setLoading = debounce<(value: boolean) => void>((value) => {
    this.loading = value;
  }, 50);

  public useUserChange(callback: (user: firebase.User) => void) {
    useDisposable(() =>
      reaction(
        () => this.data.user,
        callback,
      ),
    );
  }

  public useHook() {
    this.router = useRouter();
    useRouterChange(this.onRouterChange);
    useEffect(() => {
      this.setLoading(true);
      const unregisterAuthObserver = firebase.auth().onAuthStateChanged(
        (user, ...args) => {
          this.data.user = user;
          this.setLoading(false);
          console.log(user);
          if (user) {
            this.askToLogIn = false;
            if (this.router.query.mode === 'select') {
              this.changeModeTo();
            }
          }
        },
      );
      return () => {
        unregisterAuthObserver();
      };
    }, []);
  }

  changeModeTo(mode: string = '') {
    const query = {
      ...this.router.query,
      mode,
    };
    const url = this.router.asPath.split('?')[0];
    this.router.replace(url, url, {
      shallow: true,
      query,
    });
  }

  onRouterChange = () => {
    if (this.router.query.mode === 'select') {
      this.askToLogIn = true;
    }
  }

  public async logout() {
    this.setLoading(true);
    try {
      await this.auth.signOut();
      window.location.reload(false); // monkey fix
    } catch (e) {
      // tslint:disable-next-line
      console.error(e);
    } finally {
      this.setLoading(false);
    }
  }

  public get auth() {
    return firebase.auth();
  }

  public get uiConfig() {
    return {
      signInFlow: "popup",
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      ],
      callbacks: {
        signInSuccessWithAuthResult: () => false,
      },
    };
  }
}
