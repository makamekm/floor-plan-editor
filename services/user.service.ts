import { observable, computed } from "mobx";
import debounce from "debounce";
import { useEffect } from "react";
import '../utils/firebase';
import firebase from 'firebase/app';
import { IRootService } from "./root-sevice.interface";

export class UserService implements IRootService {
  @observable loading: boolean = true;
  @observable askToLogIn: boolean = false;
  @observable private data: {
    user: firebase.User;
  } = {
    user: null,
  };

  @computed get user() {
    return this.data.user;
  }
  @computed get isOpenLoginDialog() {
    return this.askToLogIn && !this.data.user && !this.loading;
  }

  private setLoading = debounce<(value: boolean) => void>(value => {
    this.loading = value;
  }, 50);

  useHook() {
    useEffect(() => {
      this.setLoading(true);
      const unregisterAuthObserver = firebase.auth().onAuthStateChanged(
        (user) => {
          this.data.user = user;
          this.setLoading(false);
        }
      );
      return () => {
        unregisterAuthObserver();
      }
    }, []);
  }

  public async logout() {
    this.setLoading(true);
    try {
      await this.auth.signOut();
      window.location.reload(false); // monkey fix
    } catch (e) {
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
      signInFlow: 'popup',
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