import axios from 'axios';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { REPLACE_DIACRITICS } from 'src/app/utils/utils-input';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-person-modal',
  templateUrl: './person-modal.component.html'
})
export class PersonModalComponent implements OnInit {
  @Input() id_person: number | undefined;

  allCars: any[] = [];
  modal = {
    full_name: '',
    cnp: '',
    age: null,
    carIds: []
  };

  constructor(private _spinner: NgxSpinnerService, public activeModal: NgbActiveModal, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this._spinner.show();
  
    // Get car list for the dropdown
    axios.get('/api/car').then(({ data }) => {
      this.allCars = data;
    });
  
    // If editing, fetch the person details
    if (this.id_person) {
      axios.get(`/api/person/${this.id_person}`).then(({ data }) => {
        // Assume data includes a `cars` field as array of car objects
        this.modal = {
          ...data,
          carIds: data.cars?.map((c: any) => c.id) || []
        };
        this._spinner.hide();
      }).catch(() => {
        this.toastr.error('Eroare la preluarea informației!');
        this._spinner.hide();
      });
    } else {
      this._spinner.hide();
    }
  }

  save(): void {
    this._spinner.show();
  
    const payload = {
      ...this.modal,
      carIds: this.modal.carIds // Send selected car IDs to backend
    };
  
    if (!this.id_person) {
      axios.post('/api/person', payload).then(() => {
        this._spinner.hide();
        this.toastr.success('Informația a fost salvată cu succes!');
        this.activeModal.close();
      }).catch(() => this.toastr.error('Eroare la salvarea informației!'));
    } else {
      axios.put('/api/person', payload).then(() => {
        this._spinner.hide();
        this.toastr.success('Informația a fost modificată cu succes!');
        this.activeModal.close();
      }).catch(() => this.toastr.error('Eroare la modificarea informației!'));
    }
  }

  selectSearch(term: string, item: any): boolean {
    const isWordThere = [] as any;
    const splitTerm = term.split(' ').filter(t => t);

    item = REPLACE_DIACRITICS(item.name);

    splitTerm.forEach(term => isWordThere.push(item.indexOf(REPLACE_DIACRITICS(term)) !== -1));
    const all_words = (this_word: any) => this_word;

    return isWordThere.every(all_words);
  }
}
